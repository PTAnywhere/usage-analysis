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
  .directive('slider', ['baseUrl', function(baseUrl) {
      function createSlider(container, max, val, onSlide, onStop) {
          return container.slider({
                    range: "min",
                    value: val,
                    min: 1,
                    max: max,
                    slide: onSlide,
                    stop: onStop
                  });
      }

      function getValue(container) {
          return container.slider('value');
      }

      return {
          restrict: 'C',
          templateUrl: baseUrl + '/static/html/directives/slider.html',
          scope: {
              onSlide: '&',
              onChange: '&',
              sliderMax: '='
          },
          link: function($scope, $element, $attrs) {
              $scope.container = $($element.find('div')[0]);
              $scope.sliderVal = ($scope.sliderMax>=3)? 3: $scope.sliderMax;
              createSlider($scope.container, $scope.sliderMax, $scope.sliderVal,
                  function(event, ui) {
                      $scope.onSlide({value: ui.value});
                  },
                  function(event, ui) {
                      $scope.onChange({value: ui.value});
                  }
              );
              $scope.onSlide({value: getValue($scope.container)});
          }
      };
  }]);