angular.module('ptAnywhere.dashboard.stateDiagram')
    .directive('stateDiagram', ['DiagramHelperService', function(StateDiagramHelper) {
        return {
            restrict: 'C',
            template: '<div></div>',
            scope: {
                  data: '=',
                levelsToShow: '=',
                finalDisplayed: '@'
            },
            link: function($scope, $element, $attrs) {
                  StateDiagramHelper.init($element.find('div')[0], $scope.finalDisplayed==='true');
                $scope.$watchGroup(['data', 'levelsToShow'], function(newValues, oldValues) {
                    StateDiagramHelper.update(newValues[0], newValues[1]);
                });
            }
        };
    }]);