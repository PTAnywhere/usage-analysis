angular.module('dashboardApp.session')
  .controller('ScriptController', ['SessionsService', '$routeParams', function(SessionsService, $routeParams) {
      var self = this;
      self.statements = [];

      SessionsService.getStatements($routeParams.id).then(function(response) {
          self.statements = response.data.statements;
      }, function(error) {
          console.error(error);
      });
  }]);