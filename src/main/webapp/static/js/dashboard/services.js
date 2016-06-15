angular.module('dashboardApp')
  .factory('TimeCache', [function() {
      return {
        getDefaultStart: function() {
          var date = localStorage.getItem('startISO');
          if (date==null) {
            return moment().startOf('day');
          }
          return moment(date);
        },
        getDefaultEnd: function() {
          var date = localStorage.getItem('endISO');
          if (date==null) {
            return moment().endOf('day');
          }
          return moment(date);
        },
        store: function(startDateISO, endDateISO) {
            // For convenience, but it is not really important if it doesn't work.
            localStorage.setItem('startISO', startDateISO);
            localStorage.setItem('endISO', endDateISO);
        }
      };
  }])
  .factory('SessionsService', ['$http', 'baseUrl', function($http, baseUrl) {
    return {
        list: function(params) {
          return $http.get(baseUrl + '/a/data/sessions', {params: params});
        }
    };
  }]);