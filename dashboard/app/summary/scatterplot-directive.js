angular.module('ptAnywhere.dashboard')
    .directive('scatterplot', [function() {
        function createChart(element, data, options) {
            var container = element.find('.scatter')[0];
            var dataset = new vis.DataSet(data);
            return new vis.Graph2d(container, dataset, options);
        }

        return {
            restrict: 'C',
            template: '<div ng-if="chartData === null">Loading...</div><div class="scatter"></div>',
            scope: {
                chartData: '=',
                chartOptions: '='
            },
            link: function($scope, $element, $attrs) {
                $scope.chart = null;
                $scope.$watch('chartData', function(newValue, oldValue) {
                    if (newValue!==null) {
                        if ($scope.chart === null) {
                            $scope.chart = createChart($element, newValue, $scope.chartOptions);
                        } else {
                            $scope.chart.destroy();  // Not so elegant
                            $scope.chart = createChart(container, newValue, $scope.chartOptions);
                        }
                    }
                });
            }
        };
    }]);