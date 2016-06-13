angular.module('dashboardApp.summary')
  .controller('SummaryController', [function() {
    var self = this;
    self.title = 'Hello';
    self.charts = [
        {name: 'EE', url: '#/'},
        {name: 'Sessions started', url: '#/started'}
    ];
  }])
  .controller('SessionsStartedController', ['$routeParams', function($routeParams) {
    console.log($routeParams);
  }]);