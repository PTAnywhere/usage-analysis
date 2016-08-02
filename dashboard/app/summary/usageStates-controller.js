angular.module('ptAnywhere.dashboard.summary')
    .controller('UsageStatesController', ['$scope', '$routeParams', 'SessionsService',
                                            function($scope, $routeParams, SessionsService) {
        var self = this;

        self.levels = 0;
        self.slidedLevels = 0;  // Temporary, chart is not updated yet.
        self.data = {states: null, levels: null};
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

        SessionsService.getSessionsUsageStates($routeParams).then(function(response) {
            self.data = response.data;
            self.maxLevels = self.data.levels.length;
            if(!$scope.$$phase) {
                $scope.$apply();
            }
        }, function(error) {
            console.error(error);
        });
    }]);