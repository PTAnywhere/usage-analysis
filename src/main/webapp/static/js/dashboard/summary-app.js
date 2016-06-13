angular.module('dashboardApp.summary', ['ngRoute', 'dashboardApp.data'])
  .config(['$injector', '$provide', function($injector, $provide) {
    // Let's make sure that the following config sections have the constants available even
    // when they have not been defined by the user.
    var constants = {
        baseUrl: ''
    };

    for (var constantName in constants) {
      try{
        $injector.get(constantName);
         //constant exists
      } catch(e){
        console.log('Setting default value for non existing "baseUrl" constant: "' + constants[constantName] + '"');
        $provide.constant(constantName, constants[constantName]);  // Set default value
      }
    }
  }])
  .config(['$routeProvider', 'baseUrl', function($routeProvider, baseUrl) {
    // baseUrl should be a "constant", "value" is not available in config phase.
    //   http://stackoverflow.com/questions/30327651/angularjs-constants-vs-values

    $routeProvider.when('/', {
      template: '<h1>AAEE</h1>'
    })
    .when('/started', {
      templateUrl: baseUrl + '/static/html/sessions-started.html'
    })
    .otherwise({
        redirectTo: '/'
    });
  }]);
