angular.module('dashboardApp.data', ['dashboardApp'])
  .factory('SessionsService', ['$http', 'baseUrl', function($http, baseUrl) {
    return {
        list: function(params) {
          return $http.get(baseUrl + '/a/data/sessions', {params: params});
        }
    };
  }]);