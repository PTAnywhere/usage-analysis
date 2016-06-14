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
  }]);
