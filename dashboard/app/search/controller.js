angular.module('dashboardApp.search', ['ae-datetimepicker', 'dashboardApp'])
  .controller('SearchController', ['$window', 'TimeCache', 'SessionsService', 'UrlUtils',
                                    function($window, TimeCache, SessionsService, UrlUtils) {
    var self = this;
    var dateFormat = 'YYYY/MM/DD HH:mm';

    self.startTime = TimeCache.getDefaultStart();
    self.endTime = TimeCache.getDefaultEnd();
    self.startTimeOptions = {format: dateFormat};
    self.endTimeOptions = {format: dateFormat, minDate: moment(self.startTime).add(1, 'hours')};

    self.actionsNum = 1;
    self.containsCommand = '';
    self.sessions = [];


    function getURLParams() {
        var startISO = self.startTime.toISOString();
        var endISO = self.endTime.toISOString();
        var ret = {start: startISO, end: endISO};
        TimeCache.store(startISO, endISO);
        return ret;
    }

    function getParams() {
        var ret = getURLParams();
        ret.minStatements = self.actionsNum;
        ret.containsCommand = self.containsCommand;
        return ret;
    }

    self.getUrlParams = function() {
        return UrlUtils.serialize(getParams());
    };

    self.startTimeUpdate = function() {
        self.endTimeOptions.minDate = moment(self.startTime).add(1, 'hours');
        if (self.endTime < self.endTimeOptions.minDate) {
            self.endTime = self.endTimeOptions.minDate;
        }
    };

    self.list = function() {
        SessionsService.list(getParams()).then(function(response) {
                self.sessions = response.data;
            }, function(error) {
                console.error(error);
            });
    };

    self.showStatesChart = function() {
        $window.location.href = 'summary.html#/usage' + self.getUrlParams();
    };

    self.showSessionsStartedHistogram = function() {
        $window.location.href = 'summary.html#/started' + self.getUrlParams();
    };

    self.showInteractionCountingHistogram = function() {
        $window.location.href = 'summary.html#/activity' + self.getUrlParams();
    };

    self.showInteractionCountingScatterplot = function() {
        $window.location.href = 'summary.html#/scatterplot' + self.getUrlParams();
    };
  }]);