angular.module('ptAnywhere.dashboard.summary.ibook')
    // Controller for usage states diagram with predefined search parameters to be embeded in ibook chapter
    .controller('StaticUsageStatesController', ['$scope', '$timeout', 'SessionsService',
                                            function($scope, $timeout, SessionsService) {
        var self = this;

        self.selectedLevels = 0;
        self.slidedLevels = 0;  // Temporary, chart is not updated yet.
        self.maxLevels = 0;

        self.data = {states: null, levels: null};

        self.onSlide = function(val) {
            self.slidedLevels = val;
            $scope.$apply();
        };

        SessionsService.getSessionsUsageStates({
            start: '2016-01-27T20:00:00.000Z',
            end: '2016-01-29T23:00:00.000Z',
            minStatements: 1
            //&containsCommand=
        }).then(function(response) {
            self.data = response.data;

            // Let's make sure that the maximum range is set before the other values are modified.
            $timeout(function() {
                self.maxLevels = self.data.levels.length;
                // We limit the size of the chart so it can be properly visualized in the iBook.
                if (self.maxLevels>20) self.maxLevels = 20;
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