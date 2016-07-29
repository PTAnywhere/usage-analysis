angular.module('ptAnywhere.dashboard.summary')
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
    }]);