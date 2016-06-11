angular.module('dashboardApp.summary', ['ngRoute'])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
      template: '<h1>AAEE</h1>'
    })
    .when('/l', {
      template: '<h1>DDEE</h1>'
    });
  }]);