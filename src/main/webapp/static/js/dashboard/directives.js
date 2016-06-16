angular.module('dashboardApp')
  .directive('barChart', ['baseUrl', function(baseUrl) {
    function createChart(ctx, data) {
        return new Chart(ctx, {type: 'bar', data: data, options: {barPercentage: 1.0}});
    }

    return {
        restrict: 'C',
        templateUrl: baseUrl + '/static/html/directives/chart.html',
        scope: {
            chartData: '='
        },
        controller: function($scope, $element, $attrs) {
            $scope.chart = null;
            $scope.$watch('chartData', function(newValue, oldValue) {
                if (newValue!==null) {
                    if ($scope.chart === null) {
                        var ctx = $element.find('canvas')[0].getContext('2d');
                        $scope.chart = createChart(ctx, $scope.chartData);
                    } else {
                        $scope.chart.destroy();
                        $scope.chart = createChart(ctx, $scope.chartData);
                        /*chart.data = newValue;
                        chart.update();*/
                    }
                }
            });
        }
    };
  }])
  .directive('scatterplot', ['baseUrl', function(baseUrl) {
    function createChart($element, data, options) {
        var container = $element.find('.scatter')[0];
        var dataset = new vis.DataSet(data);
        var options = options;
        return new vis.Graph2d(container, dataset, options);
    }

    return {
        restrict: 'C',
        templateUrl: baseUrl + '/static/html/directives/scatterplot.html',
        scope: {
            chartData: '=',
            chartOptions: '='
        },
        controller: function($scope, $element, $attrs) {
            $scope.chart = null;
            $scope.$watch('chartData', function(newValue, oldValue) {
                if (newValue!==null) {
                    if ($scope.chart === null) {
                        $scope.chart = createChart($element, newValue, $scope.chartOptions);
                    } else {
                        $scope.chart.destroy();  // Not so elegant
                        $scope.chart = createChart(container, newValue, $scope.chartOptions)
                    }
                }
            });
        }
    };
  }])
  .directive('slider', [function() {
      var container;

      function createSlider($element, onSlide, onStop) {
          container = $($element.find('div')[0]);
          container.slider({range: "min", slide: onSlide, stop: onStop});
      }

      function getValue() {
          return container.slider('value');
      }

      function updateLimits(newMax, $scope) {
          // The order is importante: if min changes and the slider is there, it will get the new value
          var oldSliderVal = getValue();
          container.slider('option', 'min', (newMax === 0)? 0: 1);
          container.slider('option', 'max', newMax);

          if (oldSliderVal === 0 || newMax < oldSliderVal) {
              container.slider('value', (newMax>=3)? 3: newMax);
              // Trigger the event (not done automatically when we change the value programmatically)
              $scope.onChange({value: getValue()});
          }
      }

      return {
          restrict: 'C',
          template: '<div></div>',
          scope: {
              onSlide: '&',
              onChange: '&',
              sliderMax: '='
          },
          link: function($scope, $element, $attrs) {
              createSlider($element, function(event, ui) {
                      $scope.onSlide({value: ui.value});
                  },
                  function(event, ui) {
                      $scope.onChange({value: ui.value});
                  }
              );
              updateLimits($scope.sliderMax, $scope);

              $scope.$watch('sliderMax', function(newMax, oldMax) {
                  updateLimits(newMax, $scope);
              });
          }
      };
  }])
  .directive('stateDiagram', [function() {
    var network;
    var nodes = new vis.DataSet();
    var edges = new vis.DataSet();

    function init(container) {
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
    }

    function getRandomColor() {
      var letters = '0123456789ABCDEF'.split('');
      var color = '#';
      for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    }

    function drawStates(states, levelsToShow) {
      nodes.clear();
      for (var i = 0; i  < levelsToShow; i++) {
        var color = getRandomColor();
        for (var j = 0; j < states.length; j++) {
          nodes.add(
            {id: String(i) + ":" + String(j), label: states[j], color: color, size: 10, x: 100 * j, y: 100 * (i + 1)}
          );
        }
      }
      nodes.add(
        {id: 'init', label: 'init', color: getRandomColor(), x: 100 * (states.length - 1) / 2.0, y: 0, size: 10}
      );
      var color = getRandomColor();
      nodes.add([
        {id: 'pass', label: 'pass', color: color, size: 10, x: 100 * (states.length - 1) / 3.0, y: 100 * (levelsToShow +1 )},
        {id: 'fail', label: 'fail', color: color, size: 10, x: 200 * (states.length - 1) / 3.0, y: 100 * (levelsToShow+ 1 )},
      ]);
    }

    function drawEdges(levels, levelsToShow) {
        edges.clear();
        for (var i = 0; i < levels.length && i < levelsToShow; i++) {
            edges.add(levels[i]);
        }
        //currentState = (Math.random()>0.5)? "pass": "fail";
        //edges.add({ 'from': previousState, 'to': currentState });
    }

    function updateChart(data, levelsToShow) {
        drawStates(data.states, levelsToShow);
        drawEdges(data.levels, levelsToShow);
        network.fit(); // zoom to fit
    }

    return {
      restrict: 'C',
      template: '<div></div>',
      scope: {
          data: '=',
          levelsToShow: '='
      },
      link: function($scope, $element, $attrs) {
          init($element.find('div')[0]);
          $scope.$watchGroup(['data', 'levelsToShow'], function(newValues, oldValues) {
              updateChart(newValues[0], newValues[1]);
          });
      }
    };
  }]);