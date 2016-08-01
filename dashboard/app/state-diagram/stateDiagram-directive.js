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
                $scope.$watch('data', function(newValue, oldValue) {
                    StateDiagramHelper.update(newValue, newValue);
                });
                $scope.$watch('levelsToShow', function(newValue, oldValue) {
                    StateDiagramHelper.display(newValue);
                });
            }
        };
    }]);