angular.module('dashboardApp.session')
  .controller('SessionController', ['$routeParams', '$scope', 'ROUTES', 'UrlUtils',
                                    function($routeParams, $scope, ROUTES, UrlUtils) {
    var self = this;
    self.uiid = 'id';
    self.visualizations = [];

    function getVisualizationStructure(vis, urlParams) {
        var ret = [];
        for (var k in vis) {
            ret.push({
                name: vis[k].name,
                url: '#' + vis[k].path + urlParams
            });
        }
        return ret;
    }

    // The $routeParams service is populated asynchronously. Therefore, it must be empty in the main controller.
    $scope.$on('$routeChangeSuccess', function() {
        self.uiid = $routeParams.id;
        var urlParams = UrlUtils.serialize($routeParams);
        self.visualizations = getVisualizationStructure(ROUTES, urlParams);
    });
  }]);