angular.module('ptAnywhere.dashboard.summary')
    .controller('SummaryController', ['$routeParams', '$scope', 'ROUTES', 'UrlUtils',
                                        function($routeParams, $scope, ROUTES, UrlUtils) {
        var self = this;

        function getChartsStructure(chart, urlParams) {
            var ret = [];
            for (var k in chart) {
                ret.push({
                    name: chart[k].name,
                    url: '#' + chart[k].path + urlParams
                });
            }
            return ret;
        }

        // The $routeParams service is populated asynchronously. Therefore, it must be empty in the main controller.
        $scope.$on('$routeChangeSuccess', function() {
            var urlParams = UrlUtils.serialize($routeParams);
            self.charts = getChartsStructure(ROUTES, urlParams);
        });
    }]);