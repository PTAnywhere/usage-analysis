angular.module('ptAnywhere.dashboard.summary')
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
    }]);