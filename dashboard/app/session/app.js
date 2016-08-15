angular.module('ptAnywhere.dashboard.session', ['ngRoute', 'ptAnywhere.dashboard', 'ptAnywhere.dashboard.templates',
                                                'ptAnywhere.dashboard.stateDiagram'])
    .constant('ROUTES', {
        script: {name: 'Session script', path: '/script'},
        states: {name: 'States diagram', path: '/steps'},
        // External web page, not part of AngularJS application (yet).
        replayer: {name: 'Replayer', url: 'sessions/{id}/replayer.html'}
    })
    .config(['$routeProvider', 'ROUTES', function($routeProvider, ROUTES) {
        $routeProvider.when(ROUTES.script.path, {
            templateUrl: 'session-script.html'
        })
        .when(ROUTES.states.path, {
            templateUrl: 'session-steps.html'
        })
        .otherwise({
            redirectTo: ROUTES.script.path
        });
    }]);
