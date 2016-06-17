angular.module('dashboardApp.summary', ['ngRoute', 'dashboardApp'])
  .constant('ROUTES', {
    steps: {name: 'Usage steps', path: '/usage'},
    started: {name: 'Sessions started', path: '/started'},
    activity_count: {name: 'Activity count', path: '/activity'},
    activity_scatterplot: {name: 'Activity volume over time', path: '/scatterplot'}
  })
  .config(['$routeProvider', 'baseUrl', 'ROUTES', function($routeProvider, baseUrl, ROUTES) {
    // 'baseUrl' should be a 'constant', 'value' is not available in config phase.
    //   http://stackoverflow.com/questions/30327651/angularjs-constants-vs-values

    $routeProvider.when(ROUTES.steps.path, {
      templateUrl: baseUrl + '/static/html/usage-steps.html'
    })
    .when(ROUTES.started.path, {
      templateUrl: baseUrl + '/static/html/sessions-started.html'
    })
    .when(ROUTES.activity_count.path, {
      templateUrl: baseUrl + '/static/html/activities-count.html'
    })
    .when(ROUTES.activity_scatterplot.path, {
          templateUrl: baseUrl + '/static/html/activities-scatterplot.html'
        })
    .otherwise({
        redirectTo: ROUTES.started.path
    });

    // Configure Chart.js style
    Chart.defaults.global.elements.line.backgroundColor = 'rgba(151,187,205,0.8)';
    Chart.defaults.global.elements.rectangle.backgroundColor = 'rgba(151,187,205,0.7)';
    Chart.defaults.global.legend.display = false;
  }]);
