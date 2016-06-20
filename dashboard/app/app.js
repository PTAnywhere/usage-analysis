angular.module('dashboardApp', [])
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
  }]);
