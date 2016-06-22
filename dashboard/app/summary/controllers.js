angular.module('dashboardApp.summary')
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
        var urlParams = UrlUtils.getUrlParams($routeParams);
        self.charts = getChartsStructure(ROUTES, urlParams);
    });
  }])
  .controller('SessionsStartedController', ['$routeParams', 'SessionsService', function($routeParams, SessionsService) {
    var self = this;
    self.data = null;

    function createLabels(beginDate, steps) {
        var ret = [];
        for (var i=0; i<steps; i++) {
            ret.push(beginDate.format('MM/DD/YYYY HH'));
            beginDate.add(1, 'hours');
        }
        return ret;
    }

    function createData(startTime, rawData) {
        return {
            labels: createLabels(startTime, rawData.length),
            datasets: [
                {label: 'Sessions started', data: rawData}
            ]
        };
    }

    SessionsService.getSessionCount($routeParams).then(function(response) {
        self.data = createData(moment(response.data.start), response.data.values);
    }, function(error) {
        console.error(error);
    });
  }])
  .controller('ActivityCountController', ['$routeParams', 'SessionsService', function($routeParams, SessionsService) {
    var self = this;
    self.data = null;

    function createLabels(steps) {
        var ret = [];
        for (var i=1; i<=steps; i++) {
            ret.push(i);
        }
        return ret;
    }

    function createData(rawData) {
        return {
            labels: createLabels(rawData.length),
            datasets: [
                {label: 'Sessions with this amount of activities', data: rawData}
            ]
        };
    }

    SessionsService.getActivityVolumePerSession($routeParams).then(function(response) {
        self.data = createData(response.data);
    }, function(error) {
        console.error(error);
    });
  }])
  .controller('ActivityScatterplot', ['$routeParams', 'SessionsService', function($routeParams, SessionsService) {
      var self = this;
      self.sessions = null;
      self.options = {
        sort: false,
        sampling:false,
            style:'points',
            dataAxis: {
                showMinorLabels: false,
                left: {title: {text: 'Number of interactions'}},
                right: {title: {text: 'Session starting time'}}
            },
            drawPoints: {
                enabled: true,
                size: 6,
                style: 'circle' // square, circle
            },
            defaultGroup: 'Scatterplot'
      };

      SessionsService.getSessionsForScatterplot($routeParams).then(function(response) {
          var sessions = response.data;
          // string to moments
          for(var i=0; i < sessions.length; i++) {
            sessions[i].x = moment(sessions[i].x);
            // I don't like the way they look inline.
            // items[i].label = { content: items[i].label };
          }
          self.sessions = sessions;
      }, function(error) {
          console.error(error);
      });
  }])
  .controller('UsageStatesController', ['$scope', '$routeParams', 'SessionsService', function($scope, $routeParams, SessionsService) {
      var self = this;
      self.levels = 0;
      self.slidedLevels = 0;  // Temporary, chart is not updated yet.
      self.data = {states: [], levels: []};
      self.maxLevels = 0;

      self.onSlide = function(val) {
          self.slidedLevels = val;
          // This function must be called at the directive init
          if(!$scope.$$phase) {
              $scope.$apply();
          }
      };
      self.onChange = function(val) {
         self.levels = val;
         self.slidedLevels = val;
         if(!$scope.$$phase) {
             $scope.$apply();
         }
      };

      SessionsService.getSessionsUsageStates($routeParams).then(function(response) {
          self.data = response.data;
          self.maxLevels = self.data.levels.length;
          if(!$scope.$$phase) {
              $scope.$apply();
          }
      }, function(error) {
          console.error(error);
      });
  }]);