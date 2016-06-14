angular.module('dashboardApp.summary', ['ngRoute', 'dashboardApp.data'])
  .constant('ROUTES', {
    started: {name: 'Sessions started', path: '/started'},
    activity_count: {name: 'Activity count', path: '/activity'}
  })
  .config(['$injector', '$provide', function($injector, $provide) {
    // Let's make sure that the following config sections have the constants available even
    // when they have not been defined by the user.
    var constants = {
        baseUrl: ''
    };

    for (var constantName in constants) {
      try {
        $injector.get(constantName);
         //constant exists
      } catch(e){
        console.log('Setting default value for non existing "baseUrl" constant: "' + constants[constantName] + '"');
        $provide.constant(constantName, constants[constantName]);  // Set default value
      }
    }
  }])
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
