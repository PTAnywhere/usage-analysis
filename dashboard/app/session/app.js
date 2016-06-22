angular.module('dashboardApp.session', ['ngRoute', 'dashboardApp'])
  .constant('ROUTES', {
    script: {name: 'Session script', path: '/script'},
    states: {name: 'States diagram', path: '/steps'}
  })
  .config(['$routeProvider', 'baseUrl', 'ROUTES', function($routeProvider, baseUrl, ROUTES) {
    // 'baseUrl' should be a 'constant', 'value' is not available in config phase.
    //   http://stackoverflow.com/questions/30327651/angularjs-constants-vs-values

    $routeProvider.when(ROUTES.script.path, {
      templateUrl: baseUrl + '/static/html/session-script.html'
    })
    .when(ROUTES.states.path, {
      templateUrl: baseUrl + '/static/html/session-steps.html'
    })
    .otherwise({
        redirectTo: ROUTES.script.path
    });
  }]);
