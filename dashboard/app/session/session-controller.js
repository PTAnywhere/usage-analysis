angular.module('ptAnywhere.dashboard.session')
  .controller('SessionController', ['$routeParams', '$scope', 'ROUTES', 'UrlUtils',
                                    function($routeParams, $scope, ROUTES, UrlUtils) {
    var self = this;
    self.uiid = 'id';
    self.visualizations = [];

    function getVisualizationStructure(vis) {
        var ret = [];
        var urlParams = UrlUtils.serialize($routeParams);
        for (var k in vis) {
            console.log(urlParams);
            var url = ('url' in vis[k])? vis[k].url.replace('{id}', self.uiid) : '#' + vis[k].path + urlParams;
            ret.push({
                name: vis[k].name,
                url: url
            });
        }
        return ret;
    }

    // The $routeParams service is populated asynchronously. Therefore, it must be empty in the main controller.
    $scope.$on('$routeChangeSuccess', function() {
        self.uiid = $routeParams.id;
        self.visualizations = getVisualizationStructure(ROUTES);
    });
  }]);