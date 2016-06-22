angular.module('dashboardApp')
  .factory('UrlUtils', [function() {
      return {
          serialize: function(params) {
              var ret = '';
              for (var name in params) {
                  ret += name + '=' + params[name] + '&';
              }
              if (ret !== '')
                  ret = '?' + ret.substring(0, ret.length-1);
              return ret;
          }
      };
  }])
  .factory('TimeCache', [function() {
      return {
        getDefaultStart: function() {
          var date = localStorage.getItem('startISO');
          if (date === null) {
            return moment().startOf('day');
          }
          return moment(date);
        },
        getDefaultEnd: function() {
          var date = localStorage.getItem('endISO');
          if (date === null) {
            return moment().endOf('day');
          }
          return moment(date);
        },
        store: function(startDateISO, endDateISO) {
            // For convenience, but it is not really important if it doesn't work.
            localStorage.setItem('startISO', startDateISO);
            localStorage.setItem('endISO', endDateISO);
        }
      };
  }])
  .factory('SessionsService', ['$http', 'baseUrl', function($http, baseUrl) {
    return {
        list: function(params) {
          return $http.get(baseUrl + '/a/data/sessions', {params: params});
        },
        getSessionCount: function(params) {
            return $http.get(baseUrl + '/a/data/sessions/counter', {params: params});
        },
        getActivityVolumePerSession: function(params) {
            return $http.get(baseUrl + '/a/data/sessions/perStatements', {params: params});
        },
        getSessionsForScatterplot: function(params) {
            return $http.get(baseUrl + '/a/data/sessions/scatterplot', {params: params});
        },
        getSessionsUsageStates: function(params) {
            return $http.get(baseUrl + '/a/data/usage', {params: params});
        },
        getSessionUsageStates: function(sessionId) {
            var arrayOfPromises = [
                $http.get(baseUrl + '/a/data/usage/' + sessionId + '/passed'),
                $http.get(baseUrl + '/a/data/usage/' + sessionId)
            ];
            return Promise.all(arrayOfPromises)
                            .then(function(arrayOfResponses) {
                                var diagram = arrayOfResponses[1].data;
                                var finalState = (arrayOfResponses[0].data.passed)? 'pass': 'fail';

                                // Only one session, only one transition per level
                                var lastState = diagram.levels[diagram.levels.length-1][0].to;

                                var finalLevel = [{from: lastState, to: finalState, value: 1, title: "1 session"}];
                                diagram.levels.push(finalLevel);
                                return diagram;
                            });
        },
        getStatements: function(sessionId) {
            return $http.get(baseUrl + '/a/data/sessions/' + sessionId);
        }
    };
  }])
  .factory('StateDiagramHelper', [function() {
    var network;
    var nodes = new vis.DataSet();
    var edges = new vis.DataSet();
    var finalStateDisplayed = false;

    function getRandomColor() {
      var letters = '0123456789ABCDEF'.split('');
      var color = '#';
      for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    }

    function drawStates(states, levelsToShow) {
      var color = null;

      nodes.clear();
      for (var i = 0; i  < levelsToShow; i++) {
        color = getRandomColor();
        for (var j = 0; j < states.length; j++) {
          nodes.add(
            {id: String(i) + ":" + String(j), label: states[j], color: color, size: 10, x: 100 * j, y: 100 * (i + 1)}
          );
        }
      }
      nodes.add(
        {id: 'init', label: 'init', color: getRandomColor(), x: 100 * (states.length - 1) / 2.0, y: 0, size: 10}
      );
      color = getRandomColor();
      nodes.add([
        {id: 'pass', label: 'pass', color: color, size: 10, x: 100 * (states.length - 1) / 3.0, y: 100 * (levelsToShow +1 )},
        {id: 'fail', label: 'fail', color: color, size: 10, x: 200 * (states.length - 1) / 3.0, y: 100 * (levelsToShow+ 1 )},
      ]);
      return nodes;
    }

    function drawEdges(levels, levelsToShow) {
        edges.clear();
        for (var i = 0; i < levels.length && i < levelsToShow; i++) {
            edges.add(levels[i]);
        }
        //currentState = (Math.random()>0.5)? "pass": "fail";
        //edges.add({ 'from': previousState, 'to': currentState });
        return edges;
    }

    return {
        init: function(container, fsd) {
          if (typeof finalStateDisplayed !== 'undefined') finalStateDisplayed = fsd;  // Might be undefined.
          var netData = {nodes: nodes, edges: edges};
          var options = {
              nodes: {
                shape: 'dot',
                font: {face: 'Tahoma'}
              },
              edges: {
                width: 0.1,
                smooth: {type: 'continuous'},
                arrows: {to: {scaleFactor: 0.2}}
              },
              interaction: {dragNodes: false},
              physics:{enabled: false}
          };

          network = new vis.Network(container, netData, options);
        },
        _getRandomColor: getRandomColor,
        _drawStates: drawStates,
        _drawEdges: drawEdges,
        update: function(data, levelsToShow) {
            drawStates(data.states, levelsToShow);
            // If we have final transitions and we are showing "all" levels (levels-1),
            // draw also the final state transitions.
            var extraLevel = (finalStateDisplayed && levelsToShow + 1 == data.levels.length)? 1: 0;
            drawEdges(data.levels, levelsToShow + extraLevel);
            network.fit(); // zoom to fit
        }
    };
  }]);