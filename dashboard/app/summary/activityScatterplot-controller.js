angular.module('ptAnywhere.dashboard.summary')
    .controller('ActivityScatterplotController', ['$routeParams', 'SessionsService',
                                                    function($routeParams, SessionsService) {
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
  }]);