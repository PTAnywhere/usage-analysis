angular.module('dashboardApp.summary', ['ngRoute', 'dashboardApp'])
  .constant('ROUTES', {
    started: {name: 'Sessions started', path: '/started'},
    activity_count: {name: 'Activity count', path: '/activity'}
  })
  .config(['$routeProvider', 'baseUrl', 'ROUTES', function($routeProvider, baseUrl, ROUTES) {
    // 'baseUrl' should be a 'constant', 'value' is not available in config phase.
    //   http://stackoverflow.com/questions/30327651/angularjs-constants-vs-values

    $routeProvider.when(ROUTES.started.path, {
      templateUrl: baseUrl + '/static/html/sessions-started.html'
    })
    .when(ROUTES.activity_count.path, {
      templateUrl: baseUrl + '/static/html/activities-count.html'
    })
    .otherwise({
        redirectTo: ROUTES.started.path
    });

    // Configure Chart.js style
    Chart.defaults.global.elements.line.backgroundColor = 'rgba(151,187,205,0.8)';
    Chart.defaults.global.elements.rectangle.backgroundColor = 'rgba(151,187,205,0.7)';
    Chart.defaults.global.legend.display = false;
  }])
  .directive('barChart', ['baseUrl', function(baseUrl) {
    function createChart(ctx, data) {
        var options = {
            barPercentage: 1.0
        };
        return new Chart(ctx, {type: 'bar', data: data, options: options});
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
