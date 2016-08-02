angular.module('ptAnywhere.dashboard')
    .directive('scatterplot', [function() {
        return {
            restrict: 'C',
            template: '<div class="loader">Loading...</div>',
            scope: {
                data: '=',
                options: '='
            },
            link: function($scope, $element, $attrs) {
                $scope.chart = null;
                $scope.$watch('data', function(newValue, oldValue) {
                    if (newValue !== null) {
                        var el = angular.element('<div class="scatter"></div>')[0];
                        var dataSet = new vis.DataSet(newValue);
                        $scope.chart = new vis.Graph2d(el, dataSet, $scope.options);
                        $element.replaceWith(el);
                    }
                });
                $scope.$on('$destroy', function() {
                    if ($scope.chart !== null) {
                        $scope.chart.destroy();
                    }
                });
            }
        };
    }]);