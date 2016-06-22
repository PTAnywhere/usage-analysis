angular.module('dashboardApp.session', ['ngRoute', 'dashboardApp'])
  .controller('UsageStatesController', ['$scope', '$routeParams', 'SessionsService', function($scope, $routeParams, SessionsService) {
      var self = this;
      self.levels = 0;
      self.slidedLevels = 0;  // Temporary, chart is not updated yet.
      self.data = {states: [], levels: []};
      self.maxLevels = 0;

      self.onSlide = function(val) {
          self.slidedLevels = val;
          // This function must be called at the directive init
          if(!$scope.$$phase) {
              $scope.$apply();
          }
      };
      self.onChange = function(val) {
         self.levels = val;
         self.slidedLevels = val;
         if(!$scope.$$phase) {
             $scope.$apply();
         }
      };

      var sessionID = '7ba8361b-e9a2-4e26-8a64-f88c35513e24';
      SessionsService.getSessionUsageStates(sessionID).then(function(diagramData) {
          self.data = diagramData;
          self.maxLevels = self.data.levels.length - 1;  // Final state has been added in this controller
          if(!$scope.$$phase) {
              $scope.$apply();
          }
      }, function(error) {
          console.error(error);
      });
  }]);