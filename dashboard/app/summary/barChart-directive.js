angular.module('ptAnywhere.dashboard.summary')
    .directive('barChart', [function() {
        return {
            restrict: 'C',
            template: '<div ng-show="chartData === null"><div class="loader">Loading...</div></div>'+
                       '<canvas style="width: 100%; height: 400px;"></canvas>',
            scope: {
                chartData: '='
            },
            link: function($scope, $element, $attrs) {
                $scope.$watch('chartData', function(newValue, oldValue) {
                    if (newValue!==null) {
                        var ctx = $element.find('canvas')[0].getContext('2d');
                        $scope.chart = new Chart(ctx, { type: 'bar',
                                                        data: $scope.chartData,
                                                        options: {barPercentage: 1.0}
                                        });
                    }
                });
                $scope.$on('$destroy', function() {
                    $scope.chart.destroy();
                });
            }
        };
    }]);