angular.module('ptAnywhere.dashboard.session')
  .controller('UsageStatesController', ['$scope', '$timeout', '$routeParams', 'SessionsService',
                                        function($scope, $timeout, $routeParams, SessionsService) {
      var self = this;

      self.selectedLevels = 0;
      self.slidedLevels = 0;  // Temporary, chart is not updated yet.
      self.maxLevels = 0;

      self.data = {states: null, levels: null};

      self.onSlide = function(val) {
          self.slidedLevels = val;
          $scope.$apply();
      };

      SessionsService.getSessionUsageStates($routeParams.id).then(function(diagramData) {
          self.data = diagramData;

          // Let's make sure that the maximum range is set before the other values are modified.
          $timeout(function() {
              self.maxLevels = self.data.levels.length - 1;  // Final state has been added in this controller
              // Let's make sure that the directive updates the maximum range now (i.e., runs watchers).
              $scope.$apply();
          }).then(function() {
              self.selectedLevels = (self.maxLevels >= 3)? 3: self.maxLevels;
              self.slidedLevels = self.selectedLevels;
          });
      }, function(error) {
          console.error(error);
      });
  }]);