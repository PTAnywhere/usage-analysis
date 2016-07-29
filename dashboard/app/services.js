angular.module('ptAnywhere.dashboard')
    .factory('UrlUtils', [function() {
        return {
            serialize: function(params) {
                var ret = '';
                for (var name in params) {
                    ret += name + '=' + params[name] + '&';
                }
                if (ret !== '')
                    ret = '?' + ret.substring(0, ret.length-1);
                return ret;
            }
        };
    }])
    .factory('SessionsService', ['$http', 'baseUrl', function($http, baseUrl) {
        return {
            list: function(params) {
                return $http.get(baseUrl + '/a/data/sessions', {params: params});
            },
            getSessionCount: function(params) {
                return $http.get(baseUrl + '/a/data/sessions/counter', {params: params});
            },
            getActivityVolumePerSession: function(params) {
                return $http.get(baseUrl + '/a/data/sessions/perStatements', {params: params});
            },
            getSessionsForScatterplot: function(params) {
                return $http.get(baseUrl + '/a/data/sessions/scatterplot', {params: params});
            },
            getSessionsUsageStates: function(params) {
                return $http.get(baseUrl + '/a/data/usage', {params: params});
            },
            getSessionUsageStates: function(sessionId) {
                var arrayOfPromises = [
                    $http.get(baseUrl + '/a/data/usage/' + sessionId + '/passed'),
                    $http.get(baseUrl + '/a/data/usage/' + sessionId)
                ];
                return Promise.all(arrayOfPromises)
                                .then(function(arrayOfResponses) {
                                    var diagram = arrayOfResponses[1].data;
                                    var finalState = (arrayOfResponses[0].data.passed)? 'pass': 'fail';

                                    // Only one session, only one transition per level
                                    var lastState = diagram.levels[diagram.levels.length-1][0].to;

                                    var finalLevel = [{from: lastState, to: finalState, value: 1, title: "1 session"}];
                                    diagram.levels.push(finalLevel);
                                    return diagram;
                                });
            },
            getStatements: function(sessionId) {
                return $http.get(baseUrl + '/a/data/sessions/' + sessionId);
            }
        };
    }]);