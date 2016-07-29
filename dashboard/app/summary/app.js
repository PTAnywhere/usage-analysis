angular.module('ptAnywhere.dashboard.summary', ['ngRoute', 'ptAnywhere.dashboard', 'ptAnywhere.dashboard.templates'])
    .constant('ROUTES', {
        steps: {name: 'Usage steps', path: '/usage'},
        started: {name: 'Sessions started', path: '/started'},
        activity_count: {name: 'Activity count', path: '/activity'},
        activity_scatterplot: {name: 'Activity volume over time', path: '/scatterplot'}
    })
    .config(['$routeProvider', 'ROUTES', function($routeProvider, ROUTES) {
        $routeProvider.when(ROUTES.steps.path, {
            templateUrl: 'usage-steps.html'
        })
        .when(ROUTES.started.path, {
            templateUrl: 'sessions-started.html'
        })
        .when(ROUTES.activity_count.path, {
            templateUrl: 'activities-count.html'
        })
        .when(ROUTES.activity_scatterplot.path, {
            templateUrl: 'activities-scatterplot.html'
        })
        .otherwise({
            redirectTo: ROUTES.started.path
        });

        // Configure Chart.js style
        Chart.defaults.global.elements.line.backgroundColor = 'rgba(151,187,205,0.8)';
        Chart.defaults.global.elements.rectangle.backgroundColor = 'rgba(151,187,205,0.7)';
        Chart.defaults.global.legend.display = false;
    }]);
