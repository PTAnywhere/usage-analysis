angular.module('dashboardApp.summary')
  .controller('SummaryController', ['$routeParams', '$scope', 'ROUTES', function($routeParams, $scope, ROUTES) {
    var self = this;
    self.title = 'Hello';

    // TODO extract to a service and test
    function getUrlParams(params) {
        var ret = '';
        for (var name in params) {
            ret += name + '=' + params[name] + '&';
        }
        if (ret !== '')
            ret = '?' + ret.substring(0, ret.length-1);
        return ret;
    }

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
        var urlParams = getUrlParams($routeParams);
        self.charts = getChartsStructure(ROUTES, urlParams);
    });
  }])
  .controller('SessionsStartedController', ['$routeParams', function($routeParams) {
    console.log($routeParams);
  }]);