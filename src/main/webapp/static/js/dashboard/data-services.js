angular.module('dashboardApp.data', [])
  .factory('SessionsService', ['$http', function($http) {
    return {
        list: function(params) {
          return $http.get('a/data/sessions', {params: params});
        }
    };
  }]);