/**
 * The Revealing Module Pattern.
 */
var chart = (function () {

  var data;  // Cached events per session.

  var network;

  var nodes = new vis.DataSet();
  var edges = new vis.DataSet();
  var filter = function(sessionNum) { return true; };

  function init() {
    var container = document.getElementById('networkMap');
    var netData = {
      nodes: nodes,
      edges: edges
    };
    var options = {
      nodes: {
        shape: 'dot',
        font: {
          face: 'Tahoma'
        }
      },
      edges: {
        width: 0.1,
        smooth: {
          type: 'continuous'
        },
        arrows: {
            to: {
                scaleFactor: 0.2
            },
        }
      },
      interaction: {
        dragNodes: false
      },
      physics:{
        enabled: false
      }
    };

    network = new vis.Network(container, netData, options);
  }

  function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  function drawSlider() {
    var maxLevels = data.levels.length;
    slider.init(maxLevels, updateLevelsValue, updateMap);

    // Init
    updateLevelsValue(slider.value());
    updateMap(slider.value());
  }

  function updateLevelsValue(numberOfLevels) {
    $(".number-levels").text(numberOfLevels);
  }

  function updateMap(numberOfLevels) {
      drawStates(numberOfLevels);
      drawEdges(numberOfLevels);
  }

  function drawStates(numberOfLevels) {
    nodes.clear();
    var numberOfStates = data.states.length;
    for (var i=0; i<numberOfLevels; i++) {
      var color = getRandomColor();
      for (var j=0; j<numberOfStates; j++) {
        nodes.add(
          {id: String(i) + ":" + String(j), label: data.states[j], color: color, x: 100*j, y: 100*(i+1), size: 10}
        );
      }
    }
    nodes.add(
      {id: 'init', label: 'init', color: getRandomColor(), x: 100*(numberOfStates-1)/2.0, y: 0, size: 10}
    );
    var color = getRandomColor();
    nodes.add([
      {id: 'pass', label: 'pass', color: color, x: 100*(numberOfStates-1)/3.0, y: 100*(numberOfLevels+1), size: 10},
      {id: 'fail', label: 'fail', color: color, x: 200*(numberOfStates-1)/3.0, y: 100*(numberOfLevels+1), size: 10},
    ]);
    network.fit(); // zoom to fit
  }

  function loadJSON(path, success, error) {
    $.ajax({
        dataType: "json",
        url: path,
        success: success,
        //timeout: 2000,
        error: error
    });
  }

  function countValueForEdge(edgesValues, previousState, currentState) {
        var edgeKey = previousState + ":" + currentState;
        if (!(edgeKey in edgesValues)) {
          edgesValues[edgeKey] = 0;
        }
        edgesValues[edgeKey] += 1;
  }

  function drawEdges(numberOfLevels) {
    edges.clear();
    for (var i=0; i<data.levels.length && i<numberOfLevels; i++) {
        edges.add(data.levels[i]);
    }
    //currentState = (Math.random()>0.5)? "pass": "fail";
    //edges.add({ 'from': previousState, 'to': currentState });
    network.fit(); // zoom to fit
  }

  function showLoadingError(xhr, textStatus, errorThrown) {
      if (textStatus == 'timeout') {
          errorDialog.open("The topology could not be loaded: timeout.");
      } else {
          errorDialog.open("The topology could not be loaded: " + errorThrown + ".");
      }
  }

  function loadEdges(jsonPath) {
    loadJSON(jsonPath, function(actionsPerSessions) {
      data = actionsPerSessions;
      drawSlider();
      $("#show-info").show();
    }, showLoadingError);
  }

  function filterLastSession() {
     filter = function(sessionNum) {
        return sessionNum==data.length-1;
     };
     drawEdges(slider.value());
  }

  function filterNone() {
     filter = function(sessionNum) { return true; };
     drawEdges(slider.value());
  }

  return {
      create: init,
      load: loadEdges,
      filterLast: filterLastSession,
      filterNone: filterNone,
  };

})();


var slider = (function () {
    var elId = "#slider-levels";

  function init(maxLevels, slideCallback, stopCallback) {
    var defaultSelection = (maxLevels>=3)? 3: maxLevels;
    $( elId ).slider({
      range: "min",
      value: defaultSelection,
      min: 1,
      max: maxLevels,
      slide: function( event, ui ) {
        slideCallback(ui.value);
      },
      stop: function( event, ui ) {
        stopCallback(ui.value);
      }
    });
  }

  function getSelectedValue() {
    return $( elId ).slider( "value" );
  }

  return {
      init: init,
      value: getSelectedValue,
  };
})();
