angular.module('ptAnywhere.dashboard.stateDiagram')
    .directive('stateDiagram', ['DiagramHelperService', function(StateDiagramHelper) {
        var init = false;
        return {
            restrict: 'C',
            template: '<div><div class="loader">Loading...</div></div>',
            scope: {
                data: '=',
                levelsToShow: '=',
                finalDisplayed: '@'
            },
            link: function($scope, $element, $attrs) {
                $scope.$watch('data', function(newValue, oldValue) {
                    // Otherwise keeps showing loading animation
                    if (newValue.states !== null && newValue.levels !== null) {
                        //Possible bug: vis.js does not show nodes correctly when doing:
                        //var temporaryElement = angular.element('<div></div>')[0];
                        //$element.find('div').replaceWith(temporaryElement);
                        var temporaryElement = $element.find('div')[0];
                        if (!init) {
                            // Overrides temporary loading message
                            StateDiagramHelper.init($element.find('div')[0], $scope.finalDisplayed==='true');
                            init = true;
                        }
                        // Normal update
                        StateDiagramHelper.update(newValue);

                    }
                });
                $scope.$watch('levelsToShow', function(newValue, oldValue) {
                    if (newValue > 0) {
                        StateDiagramHelper.display(newValue);
                    }
                });
            }
        };
    }]);