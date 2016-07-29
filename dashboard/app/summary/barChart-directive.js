angular.module('ptAnywhere.dashboard.summary')
    .directive('barChart', [function() {
        function createChart(ctx, data) {
            return new Chart(ctx, {type: 'bar', data: data, options: {barPercentage: 1.0}});
        }

        return {
            restrict: 'C',
            template: '<div ng-if="chartData === null">Loading...</div>'+
                       '<canvas style="width: 100%; height: 400px;"></canvas>',
            scope: {
                chartData: '='
            },
            link: function($scope, $element, $attrs) {
                $scope.chart = null;
                $scope.$watch('chartData', function(newValue, oldValue) {
                    if (newValue!==null) {
                        var ctx = $element.find('canvas')[0].getContext('2d');
                        if ($scope.chart === null) {
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
    }]);