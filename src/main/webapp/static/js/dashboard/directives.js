angular.module('dashboardApp')
  .directive('barChart', ['baseUrl', function(baseUrl) {
    function createChart(ctx, data) {
        return new Chart(ctx, {type: 'bar', data: data, options: {barPercentage: 1.0}});
    }

    return {
        restrict: 'C',
        templateUrl: baseUrl + '/static/html/directives/barChart.html',
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
  }]);
