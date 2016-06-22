angular.module('dashboardApp.script', ['dashboardApp'])
  .controller('ScriptController', ['SessionsService', function(SessionsService) {
      var self = this;
      self.statements = [];

      var sessionID = '7ba8361b-e9a2-4e26-8a64-f88c35513e24';
      SessionsService.getStatements(sessionID).then(function(response) {
          self.statements = response.data.statements;
      }, function(error) {
          console.error(error);
      });
  }]);