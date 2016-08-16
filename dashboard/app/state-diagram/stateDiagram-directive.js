angular.module('ptAnywhere.dashboard.stateDiagram')
    .directive('stateDiagram', ['DiagramHelperService', function(DiagramHelperService) {

        function isShowingLoading(mainElement) {
            return mainElement.children().hasClass('loader');
        }

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
                        var mainElement = $element.find('div');
                        if (isShowingLoading(mainElement)) {
                            // Overrides temporary loading message
                            DiagramHelperService.init(mainElement[0], $scope.finalDisplayed==='true');
                        }
                        // Normal update
                        DiagramHelperService.update(newValue);

                    }
                });
                $scope.$watch('levelsToShow', function(newValue, oldValue) {
                    if (newValue > 0) {
                        DiagramHelperService.display(newValue);
                    }
                });
            }
        };
    }]);