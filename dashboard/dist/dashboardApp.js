/**
 * ptAnywhere.dashboard - A dashboard to analyse PT Anywhere usage.
 * @version v2.5.3
 * @link http://pt-anywhere.kmi.open.ac.uk
 */
angular.module('ptAnywhere.dashboard', [])
    .config(['$injector', '$provide', function($injector, $provide) {
        // Let's make sure that the following config sections have the constants available even
        // when they have not been defined by the user.
        var constants = {
            baseUrl: ''
        };

        for (var constantName in constants) {
            try {
                $injector.get(constantName);
                //constant exists
            } catch(e){
                console.log('Setting default value for non existing "baseUrl" constant: "' + constants[constantName] + '"');
                $provide.constant(constantName, constants[constantName]);  // Set default value
            }
        }
    }]);

angular.module('ptAnywhere.dashboard')
    .filter('simpleUuid', [function() {
        function hex2a(hexx) {
            var hex = hexx.toString(); // force conversion
            var str = '';
            for (var i = 0; i < hex.length; i += 2)
                str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
            return str;
        }

        return function(uuid) {
            var hex = uuid.replace(/-/g, ''); // remove dashes
            var base64url = btoa( hex2a(hex) );
            // Y64 variant
            return base64url.replace(/\+/g, '.')
                            .replace(/\//g, '_')
                            .replace(/=/g, '-');
        };
    }])
    .filter('momentDate', [function() {
        return function(moment, format) {
            return moment.format(format);
        };
    }]);
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
    .factory('SessionsService', ['$q', '$http', 'baseUrl', function($q, $http, baseUrl) {
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
                return $q.all(arrayOfPromises)
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
angular.module('ptAnywhere.dashboard.search', ['ae-datetimepicker', 'ptAnywhere.dashboard', 'ptAnywhere.dashboard.templates'])
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
angular.module('ptAnywhere.dashboard.search')
    .factory('TimeCache', [function() {
        return {
            getDefaultStart: function() {
                var date = localStorage.getItem('startISO');
                if (date === null) {
                    return moment().startOf('day');
                }
                return moment(date);
            },
            getDefaultEnd: function() {
                var date = localStorage.getItem('endISO');
                if (date === null) {
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
    }]);
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

angular.module('ptAnywhere.dashboard.session')
  .controller('ScriptController', ['SessionsService', '$routeParams', function(SessionsService, $routeParams) {
      var self = this;
      self.statements = null;

      SessionsService.getStatements($routeParams.id).then(function(response) {
          self.statements = response.data.statements;
      }, function(error) {
          console.error(error);
      });
  }]);
angular.module('ptAnywhere.dashboard.session')
    .directive('sessionScript', ['StatementListener', function(StatementListener) {

        var selector;
        var loaderSelector;

        function showLoading() {
            return loaderSelector.css('display', 'block');
        }

        function hideLoading() {
            return loaderSelector.css('display', 'none');
        }

        function appendHtml(html) {
          var el = angular.element(html);
          selector.append(el);
        }

        return {
            restrict: 'C',
            template: '<ol></ol><div class="loader">Loading...</div>',
            scope: {
                statements: '='
            },
            link: function($scope, $element, $attrs) {
                selector = $element.find('ol');
                loaderSelector = $element.find('div');
                var cmdSessionNumber = 0;

                StatementListener.onCreateDevice(function(dext) {
                  appendHtml('<li>Creating ' + dext[extension.device.name] + '</li>');
                }).
                onCreateLink(function(dext) {
                  var ends = dext[extension.endpoints];
                  appendHtml('<li>Connecting ' + ends[0].device + ' and ' + ends[1].device + '</li>');
                }).
                onDeleteDevice(function(dext) {
                  appendHtml('<li>Deleting ' + dext[extension.device.name] + '</li>');
                }).
                onDeleteLink(function(dext) {
                  var ends = dext[extension.endpoints];
                  appendHtml('<li>Disconnecting ' + ends[0].device + ' and ' + ends[1].device + '</li>');
                }).
                onUpdateDevice(function(dext) {
                  appendHtml('<li>Updating ' + dext[extension.device.name] + '</li>');
                }).
                onUpdatePort(function(dext) {
                  appendHtml('<li>Updating ' + dext[extension.device.name] + '\'s port: ' + dext[extension.port.name] + '</li>');
                }).
                onOpenCommandLine(function(cmdName) {
                  cmdSessionNumber++;
                  var cmdSessionId = "collapsedSession" + cmdSessionNumber;
                  var html = '<li><a data-target="#' + cmdSessionId + '" data-toggle="collapse" ' +
                             'aria-expanded="false" aria-controls="' + cmdSessionId + '">' +
                             'Using ' + cmdName + '</a><div id="' + cmdSessionId + '" class="collapse">' +
                             '<div class="well"></div></div></li>';
                  appendHtml(html);
                }).
                onCloseCommandLine(function() {
                  //appendHtml('<li>Closed</li>');
                }).
                onUseCommandLine(function(dext) {
                  //appendHtml('<li>Use</li>');
                }).
                onReadCommandLine(function(response) {
                  var cmdSessionId = "collapsedSession" + cmdSessionNumber;
                  var wellSel = $element.find('#' + cmdSessionId + ' .well');
                  wellSel.append(response);
                });

                $scope.$watch('statements', function(newValues, oldValues) {
                    if (newValues === null) {
                        showLoading();
                    } else {
                        hideLoading();
                        for(var i=0; i<newValues.length; i++) {
                            StatementListener.onStatement(newValues[i]);
                        }
                    }
                });
            }
        };
    }]);
angular.module('ptAnywhere.dashboard.session')
  .controller('SessionController', ['$routeParams', '$scope', 'ROUTES', 'UrlUtils',
                                    function($routeParams, $scope, ROUTES, UrlUtils) {
    var self = this;
    self.uiid = 'id';
    self.visualizations = [];

    function getVisualizationStructure(vis) {
        var ret = [];
        var urlParams = UrlUtils.serialize($routeParams);
        for (var k in vis) {
            console.log(urlParams);
            var url = ('url' in vis[k])? vis[k].url.replace('{id}', self.uiid) : '#' + vis[k].path + urlParams;
            ret.push({
                name: vis[k].name,
                url: url
            });
        }
        return ret;
    }

    // The $routeParams service is populated asynchronously. Therefore, it must be empty in the main controller.
    $scope.$on('$routeChangeSuccess', function() {
        self.uiid = $routeParams.id;
        self.visualizations = getVisualizationStructure(ROUTES);
    });
  }]);
// Starts with (not yet supported by all browsers)
String.prototype.startsWith = function(suffix) {
    return this.indexOf(suffix, 0) === 0;
};


function Listener() {
    this.callbacks = {
        deviceCreation: null,
        deviceRemoval: null,
        deviceUpdate: null,
        linkCreation: null,
        linkRemoval: null,
        openCmd: null,
        closeCmd: null,
        useCmd: null,
        readCmd: null
    };
}

Listener.prototype.onCreateDevice = function(creationCallback) {
    this.callbacks.deviceCreation = creationCallback;
    return this;
};

Listener.prototype.onDeleteDevice = function(removalCallback) {
    this.callbacks.deviceRemoval = removalCallback;
    return this;
};

Listener.prototype.onUpdateDevice = function(updateCallback) {
    this.callbacks.deviceUpdate = updateCallback;
    return this;
};

Listener.prototype.onUpdatePort = function(updateCallback) {
    this.callbacks.portUpdate = updateCallback;
    return this;
};

Listener.prototype.onCreateLink = function(creationCallback) {
    this.callbacks.linkCreation = creationCallback;
    return this;
};

Listener.prototype.onDeleteLink = function(removalCallback) {
    this.callbacks.linkRemoval = removalCallback;
    return this;
};

Listener.prototype.onOpenCommandLine = function(openCallback) {
    this.callbacks.openCmd = openCallback;
    return this;
};

Listener.prototype.onCloseCommandLine = function(closeCallback) {
    this.callbacks.closeCmd = closeCallback;
    return this;
};

Listener.prototype.onUseCommandLine = function(useCallback) {
    this.callbacks.useCmd = useCallback;
    return this;
};

Listener.prototype.onReadCommandLine = function(readCallback) {
    this.callbacks.readCmd = readCallback;
    return this;
};

Listener.prototype.onStatement = function(statement) {
    var dext = (statement.result === undefined)? null: statement.result.extensions;
    if (statement.verb.id === verb.create) {
        if (statement.object.id.startsWith(devices.any)) {
            if (this.callbacks.deviceCreation === null) {
                console.warn('No callback function defined for device creation.');
            } else {
                this.callbacks.deviceCreation(dext);
            }
        } else if (statement.object.id === activity.link) {
            if (this.callbacks.linkCreation === null) {
                console.warn('No callback function defined for link creation.');
            } else {
                this.callbacks.linkCreation(dext);
            }
        }
    } else if (statement.verb.id === verb.delete) {
        if (statement.object.id.startsWith(devices.any)) {
            if (this.callbacks.deviceRemoval === null) {
                console.warn('No callback function defined for device removal.');
            } else {
                this.callbacks.deviceRemoval(dext);
            }
        } else if (statement.object.id === activity.link) {
            if (this.callbacks.linkRemoval === null) {
                console.warn('No callback function defined for link removal.');
            } else {
                this.callbacks.linkRemoval(dext);
            }
        }
    } else if (statement.verb.id === verb.update) {
        if (statement.object.id.startsWith(devices.any)) {
            if (this.callbacks.deviceUpdate === null) {
                console.warn('No callback function defined for device update.');
            } else {
                this.callbacks.deviceUpdate(dext, statement.result.response);
            }
        } else if (statement.object.definition.type === activity.port) {
            if (this.callbacks.portUpdate === null) {
                console.warn('No callback function defined for device port update.');
            } else {
                this.callbacks.portUpdate(dext);
            }
        }
    } else if (statement.verb.id === verb.opened) {
        if (statement.object.definition.type === activity.commandLine) {
            if (this.callbacks.openCmd === null) {
                console.warn('No callback function defined for command line open.');
            } else {
                // It would be better to store the name as an extension too.
                this.callbacks.openCmd(statement.object.definition.name['en-GB']);
            }
        }
    } else if (statement.verb.id === verb.closed) {
        if (statement.object.definition.type === activity.commandLine) {
            if (this.callbacks.closeCmd === null) {
                console.warn('No callback function defined for command line close.');
            } else {
                this.callbacks.closeCmd();
            }
        }
    } else if (statement.verb.id === verb.use) {
        if (statement.object.definition.type === activity.commandLine) {
            if (this.callbacks.useCmd === null) {
                console.warn('No callback function defined for command line use.');
            } else {
                this.callbacks.useCmd(dext);
            }
        }
    } else if (statement.verb.id===verb.read) {
        if (statement.object.definition.type === activity.commandLine) {
            if (this.callbacks.readCmd === null) {
                console.warn('No callback function defined for command line read.');
            } else {
                this.callbacks.readCmd(statement.result.response);
            }
        }
    }
};

angular.module('ptAnywhere.dashboard.session').service('StatementListener', [Listener]);
angular.module('ptAnywhere.dashboard.session')
  .controller('UsageStatesController', ['$scope', '$timeout', '$routeParams', 'SessionsService',
                                        function($scope, $timeout, $routeParams, SessionsService) {
      var self = this;

      self.selectedLevels = 0;
      self.slidedLevels = 0;  // Temporary, chart is not updated yet.
      self.maxLevels = 0;

      self.data = {states: null, levels: null};

      self.onSlide = function(val) {
          self.slidedLevels = val;
          $scope.$apply();
      };

      SessionsService.getSessionUsageStates($routeParams.id).then(function(diagramData) {
          self.data = diagramData;

          // Let's make sure that the maximum range is set before the other values are modified.
          $timeout(function() {
              self.maxLevels = self.data.levels.length - 1;  // Final state has been added in this controller
              // Let's make sure that the directive updates the maximum range now (i.e., runs watchers).
              $scope.$apply();
          }).then(function() {
              self.selectedLevels = (self.maxLevels >= 3)? 3: self.maxLevels;
              self.slidedLevels = self.selectedLevels;
          });
      }, function(error) {
          console.error(error);
      });
  }]);
angular.module('ptAnywhere.dashboard.stateDiagram', []);
angular.module('ptAnywhere.dashboard.stateDiagram')
    .factory('DiagramHelperService', ['$q', '$timeout', function($q, $timeout) {
        var SCALE = 100;
        var network;
        var nodes = new vis.DataSet();
        var edges = new vis.DataSet();
        var maxLevels = 3;
        var levelsDisplayed = 3;
        var finalStateDisplayed = false;

        function getRandomColor() {
            var letters = '0123456789abcdef'.split('');
            var color = '#';
            for (var i = 0; i < 6; i++ ) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }

        function createStates(data) {
            var newNodes = [{
                    group: 0,
                    id: 'init',
                    label: 'init',
                    x: SCALE * ( data.states.length - 1) / 2.0,
                    y: 0
                }];

            var levelsToAdd = data.levels.length;
            if (finalStateDisplayed) {
                var finalLevel = levelsToAdd;
                levelsToAdd = finalLevel - 1;
                newNodes.push({
                    group: finalLevel,
                    id: 'pass',
                    label: 'pass',
                    x: SCALE * (data.states.length - 1) / 3.0,
                    y: SCALE * finalLevel
                });
                newNodes.push({
                    group: finalLevel,
                    id: 'fail',
                    label: 'fail',
                    x: (2 * SCALE) * (data.states.length - 1) / 3.0,
                    y: SCALE * finalLevel
                });
            }

            // Create intermediate levels
            for (var i = 0; i < levelsToAdd; i++) {
                for (var j = 0; j < data.states.length; j++) {
                    newNodes.push({
                        group: i+1,
                        id: String(i) + ":" + String(j),
                        label: data.states[j],
                        x: SCALE * j,
                        y: SCALE * (i + 1)
                    });
                }
            }
            return newNodes;
        }

        // Avoid blocking browser in consuming operations.
        function addEdgeAsync(edge) {
            return $timeout(function() {
                edges.add(edge);
            });
        }

        function createEdges(levels) {
            var newEdges = [];
            for (var i = 0; i < levels.length; i++) {
                for (var j = 0; j < levels[i].length; j++) {
                    levels[i][j].group = i;
                    newEdges.push(levels[i][j]);
                }
            }
            return newEdges;
        }

        function getGroups(steps) {
            var ret = {};
            for (var i=0; i<steps+2; i++) {  // 2 extra levels/steps: init and final state
                var color = getRandomColor();
                ret[String(i)] = {
                    color: {
                        border: color,
                        background: color,
                        highlight: {
                            border: color,
                            background: '#ffffff'
                        }
                    }
                };
            }
            return ret;
        }

        function getOptions() {
            var nodeSize = SCALE / 10;
            return {
               nodes: {
                   shape: 'dot',
                   size: nodeSize,
                   font: {face: 'Tahoma'}
               },
               edges: {
                   width: 0.1,
                   hoverWidth: 0.2,
                   smooth: {type: 'continuous'},
                   arrows: {to: {scaleFactor: 0.2}}
               },
               interaction: {dragNodes: false},
               physics: {enabled: false},
               groups: getGroups(maxLevels)
           };
        }

        function filter(item) {
            // levelsDisplayed + 1 => to consider also init state/level
            return item.group < levelsDisplayed + 1 ||
                    (levelsDisplayed + 1 === maxLevels && finalStateDisplayed);  // Show final state
        }

        function updateDisplayedData() {
            network.setData({
                nodes: nodes.get({filter: filter}),
                edges: edges.get({filter: filter})
            });
            network.fit(); // zoom to fit
        }

        return {
            init: function(container, fsd) {
                if (typeof finalStateDisplayed !== 'undefined') finalStateDisplayed = fsd;  // Might be undefined.
                maxLevels = 0;
                levelsDisplayed = maxLevels;
                var netData = {nodes: [], edges: []};
                network = new vis.Network(container, netData, getOptions());
            },
            _setFinalStateDisplayed: function(fsd) {
                finalStateDisplayed = fsd;
            },
            _getRandomColor: getRandomColor,
            _createStates: createStates,
            _createEdges: createEdges,
            update: function(data) {
                nodes.clear();
                edges.clear();
                maxLevels = data.levels.length;
                network.setOptions(getOptions());

                // Avoid blocking browser in consuming operations.
                return $timeout(function() {
                    // apparently DataSet.add is much more computation consuming than Array.push,
                    // so creating a temporary array makes sense.
                    nodes.add(createStates(data));
                }).then(function() {
                    return $timeout(function() {
                        edges.add(createEdges(data.levels));
                    }).then(function() {
                        updateDisplayedData();
                    });
                });
            },
            display: function(levelsToShow) {
                levelsDisplayed = levelsToShow;
                updateDisplayedData();
            }
        };
    }]);
angular.module('ptAnywhere.dashboard.stateDiagram')
    .directive('slider', [function() {
        var slider;

        function updateLimits(newMax) {
            if (newMax > 1) {  // Because min and max cannot have the same value
                var previousValue = slider.noUiSlider.get();
                slider.noUiSlider.updateOptions({
                    range: {
                        'min': 1,
                        'max': newMax
                    }
                });
                // "By default, the sliders values remain unchanged."
                if (previousValue > newMax) {
                    slider.noUiSlider.set(newMax);
                }
                slider.removeAttribute('disabled');
            } else {
                slider.setAttribute('disabled', true);
            }
        }

        return {
            restrict: 'C',
            require: 'ngModel',
            scope: {
                rangeMax: '=',
                onSlide: '&'
            },
            link: function($scope, $element, $attrs, ngModelCtrl) {
                slider = $element[0];

                noUiSlider.create(slider, {
                    start: 0,
                    connect: 'lower',
                    step: 1,
                    range: {
                        'min': 0,
                        'max': 1
                    },
                    format: {
                        // No formatting (not event between string and int), just integers
                        to: function(value) {
                            return value;
                        },
                        from: function(value) {
                            return value;
                        }
                    }
                });
                slider.removeAttribute('disabled');


                $scope.$watch('rangeMax', function(newMax, oldMax) {
                    updateLimits(newMax);
                });

                slider.noUiSlider.on('slide', function(values){
                    // Apparently during the slide event the "step" option is ignored.
                    $scope.onSlide({ value: Math.round(values[0]) });
                });

                // Data changed outside of AngularJS
                slider.noUiSlider.on('change', function(values){
                    // Also tell AngularJS that it needs to update the UI
                    $scope.$apply(function() {
                        // Set the data within AngularJS
                        ngModelCtrl.$setViewValue(values[0]);
                    });
                });

                // When data changes inside AngularJS
                // Notify the third party directive of the change
                ngModelCtrl.$render = function() {
                    slider.noUiSlider.set(ngModelCtrl.$viewValue);
                };
            }
        };
    }]);
angular.module('ptAnywhere.dashboard.stateDiagram')
    .directive('stateDiagram', ['DiagramHelperService', function(DiagramHelperService) {

        function isShowingLoading(mainElement) {
            return mainElement.children().hasClass('loader');
        }

        return {
            restrict: 'C',
            template: '<div><div class="loader">Loading...</div></div>',
            scope: {
                data: '=',
                levelsToShow: '=',
                finalDisplayed: '@'
            },
            link: function($scope, $element, $attrs) {
                $scope.$watch('data', function(newValue, oldValue) {
                    // Otherwise keeps showing loading animation
                    if (newValue.states !== null && newValue.levels !== null) {
                        //Possible bug: vis.js does not show nodes correctly when doing:
                        //var temporaryElement = angular.element('<div></div>')[0];
                        //$element.find('div').replaceWith(temporaryElement);
                        var mainElement = $element.find('div');
                        if (isShowingLoading(mainElement)) {
                            // Overrides temporary loading message
                            DiagramHelperService.init(mainElement[0], $scope.finalDisplayed==='true');
                        }
                        // Normal update
                        DiagramHelperService.update(newValue);

                    }
                });
                $scope.$watch('levelsToShow', function(newValue, oldValue) {
                    if (newValue > 0) {
                        DiagramHelperService.display(newValue);
                    }
                });
            }
        };
    }]);
angular.module('ptAnywhere.dashboard.summary', ['ngRoute', 'ptAnywhere.dashboard', 'ptAnywhere.dashboard.templates',
                                                'ptAnywhere.dashboard.stateDiagram'])
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
angular.module('ptAnywhere.dashboard.summary')
    .directive('barChart', [function() {
        return {
            restrict: 'C',
            template: '<div ng-show="chartData === null"><div class="loader">Loading...</div></div>'+
                       '<canvas style="width: 100%; height: 400px;"></canvas>',
            scope: {
                chartData: '='
            },
            link: function($scope, $element, $attrs) {
                $scope.$watch('chartData', function(newValue, oldValue) {
                    if (newValue!==null) {
                        var ctx = $element.find('canvas')[0].getContext('2d');
                        $scope.chart = new Chart(ctx, { type: 'bar',
                                                        data: $scope.chartData,
                                                        options: {barPercentage: 1.0}
                                        });
                    }
                });
                $scope.$on('$destroy', function() {
                    $scope.chart.destroy();
                });
            }
        };
    }]);
angular.module('ptAnywhere.dashboard')
    .directive('scatterplot', [function() {
        return {
            restrict: 'C',
            template: '<div class="loader">Loading...</div>',
            scope: {
                data: '=',
                options: '='
            },
            link: function($scope, $element, $attrs) {
                $scope.chart = null;
                $scope.$watch('data', function(newValue, oldValue) {
                    if (newValue !== null) {
                        var el = angular.element('<div class="scatter"></div>')[0];
                        var dataSet = new vis.DataSet(newValue);
                        $scope.chart = new vis.Graph2d(el, dataSet, $scope.options);
                        $element.replaceWith(el);
                    }
                });
                $scope.$on('$destroy', function() {
                    if ($scope.chart !== null) {
                        $scope.chart.destroy();
                    }
                });
            }
        };
    }]);
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
angular.module('ptAnywhere.dashboard.summary')
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
            var urlParams = UrlUtils.serialize($routeParams);
            self.charts = getChartsStructure(ROUTES, urlParams);
        });
    }]);
angular.module('ptAnywhere.dashboard.summary')
    .controller('UsageStatesController', ['$scope', '$timeout', '$routeParams', 'SessionsService',
                                            function($scope, $timeout, $routeParams, SessionsService) {
        var self = this;

        self.maxLevels = 0;
        self.selectedLevels = 0;
        self.slidedLevels = 0;  // Temporary, chart is not updated yet.

        self.data = {states: null, levels: null};

        self.onSlide = function(val) {
            self.slidedLevels = val;
            $scope.$apply();
        };

        SessionsService.getSessionsUsageStates($routeParams).then(function(response) {
            self.data = response.data;

            // Let's make sure that the maximum range is set before the other values are modified.
            $timeout(function() {
                self.maxLevels = self.data.levels.length;
                // Let's make sure that the directive updates the maximum range now (i.e., runs watchers).
                $scope.$apply();
            }).then(function() {
                self.selectedLevels = (self.maxLevels >= 3)? 3: self.maxLevels;
                self.slidedLevels = self.selectedLevels;
            });
        }, function(error) {
            console.error(error);
        });
    }]);
angular.module('ptAnywhere.dashboard.templates', []);
angular.module('ptAnywhere.dashboard.summary.ibook', ['ngRoute', 'ptAnywhere.dashboard',
                'ptAnywhere.dashboard.templates', 'ptAnywhere.dashboard.stateDiagram']);

angular.module('ptAnywhere.dashboard.summary.ibook')
    // Controller for usage states diagram with predefined search parameters to be embeded in ibook chapter
    .controller('StaticUsageStatesController', ['$scope', '$timeout', 'SessionsService',
                                            function($scope, $timeout, SessionsService) {
        var self = this;

        self.selectedLevels = 0;
        self.slidedLevels = 0;  // Temporary, chart is not updated yet.
        self.maxLevels = 0;

        self.data = {states: null, levels: null};

        self.onSlide = function(val) {
            self.slidedLevels = val;
            $scope.$apply();
        };

        SessionsService.getSessionsUsageStates({
            start: '2016-01-27T20:00:00.000Z',
            end: '2016-01-29T23:00:00.000Z',
            minStatements: 1
            //&containsCommand=
        }).then(function(response) {
            self.data = response.data;

            // Let's make sure that the maximum range is set before the other values are modified.
            $timeout(function() {
                self.maxLevels = self.data.levels.length;
                // We limit the size of the chart so it can be properly visualized in the iBook.
                if (self.maxLevels>20) self.maxLevels = 20;
                // Let's make sure that the directive updates the maximum range now (i.e., runs watchers).
                $scope.$apply();
            }).then(function() {
                self.selectedLevels = (self.maxLevels >= 3)? 3: self.maxLevels;
                self.slidedLevels = self.selectedLevels;
            });
        }, function(error) {
            console.error(error);
        });
    }]);
angular.module("ptAnywhere.dashboard.templates").run(["$templateCache", function($templateCache) {$templateCache.put("activities-count.html","<div ng-controller=\"ActivityCountController as started\">\n    <h1>Number of activities per session</h1>\n\n    <div class=\"row\">\n        <div class=\"col-md-12\">\n            <div class=\"barChart\" chart-data=\"started.data\"></div>\n        </div>\n    </div>\n</div>");
$templateCache.put("activities-scatterplot.html","<div ng-controller=\"ActivityScatterplotController as scatter\">\n    <h1>Sessions per number of activities and time</h1>\n\n    <div class=\"row\">\n        <div class=\"col-md-12\">\n            <div class=\"scatterplot loader-container\" data=\"scatter.sessions\" options=\"scatter.options\"></div>\n        </div>\n    </div>\n\n    <div class=\"row\" style=\"margin-top: 30px;\" ng-show=\"scatter.sessions !== null\">\n        <div class=\"col-md-12\">\n            <table class=\"table\">\n                <thead>\n                <th>Session</th><th>Started at</th><th>Number of interactions</th>\n                </thead>\n                <tbody>\n                    <tr ng-repeat=\"session in scatter.sessions\">\n                        <td><a href=\"session.html#/script?id={{session.label}}\">{{session.label | simpleUuid}}</a></td>\n                        <td>{{session.x | momentDate: \'LLL\'}}</td>\n                        <td>{{session.y}}</td>\n                    </tr>\n                    <tr ng-if=\"scatter.sessions.length === 0\">\n                        <td colspan=\"3\">No sessions recorded during the specified period.</td>\n                    </tr>\n                </tbody>\n            </table>\n        </div>\n    </div>\n</div>\n</div>");
$templateCache.put("session-script.html","<div ng-controller=\"ScriptController as script\">\n    <div class=\"container\">\n        <h1>Session script</h1>\n\n        <div class=\"row\" style=\"margin: 20px 0;\">\n            <div class=\"col-md-12\">\n                <div class=\"sessionScript loader-container\" statements=\"script.statements\"></div>\n            </div>\n        </div>\n    </div>\n</div>");
$templateCache.put("session-steps.html","<div ng-controller=\"UsageStatesController as usage\">\n    <h1>PT Anywhere usage summary</h1>\n\n    <div class=\"row\">\n        <div class=\"col-md-12\" style=\"margin-top: 20px;\">\n            <p>Number of levels shown in the chart: <span ng-bind=\"usage.slidedLevels\"></span>.</p>\n\n            <div class=\"slider\" ng-model=\"usage.selectedLevels\" range-max=\"usage.maxLevels\" on-slide=\"usage.onSlide(value)\"></div>\n\n            <p>Notes to interpret the chart:</p>\n            <ul>\n                <li>If a session has more than <span ng-bind=\"usage.slidedLevels\"></span> steps, the remaining ones will not be displayed.</li>\n                <li>For the sake of simplicity, the states have not been subdivided to consider the type of devices created, deleted or modified.</li>\n                <li ng-show=\"usage.slidedLevels == usage.maxLevels\">\n                    The final state is based on the solution for the experimentation session carried out in January.\n                    Note that the user of this session might have been using the widget with other purposes.</li>\n                <li ng-show=\"usage.slidedLevels < usage.maxLevels\">To avoid confusions, the final state transition is only shown if all the levels are displayed.</li>\n            </ul>\n        </div>\n    </div>\n\n    <div class=\"row\">\n        <div class=\"col-md-12\">\n            <div class=\"stateDiagram\" data=\"usage.data\" levels-to-show=\"usage.selectedLevels\" final-displayed=\"true\"></div>\n        </div>\n    </div>\n</div>");
$templateCache.put("sessions-started.html","<div ng-controller=\"SessionsStartedController as started\">\n    <h1>Sessions started</h1>\n\n    <div class=\"row\">\n        <div class=\"col-md-12\">\n            <div class=\"barChart\" chart-data=\"started.data\"></div>\n        </div>\n    </div>\n</div>");
$templateCache.put("usage-steps.html","<div ng-controller=\"UsageStatesController as usage\">\n    <h1>PT Anywhere usage summary</h1>\n\n    <div class=\"row\">\n        <div class=\"col-md-12\" style=\"margin-top: 20px;\">\n            <p>Number of levels shown in the chart: <span ng-bind=\"usage.slidedLevels\"></span>.</p>\n            <div class=\"slider\" ng-model=\"usage.selectedLevels\" range-max=\"usage.maxLevels\" on-slide=\"usage.onSlide(value)\"></div>\n\n            <p>Notes to interpret the chart:</p>\n            <ul>\n                <li>If a session has less than <span ng-bind=\"usage.slidedLevels\"></span> steps, NOOP state will be selected for the remaining levels.</li>\n                <li>If a session has more than <span ng-bind=\"usage.slidedLevels\"></span> steps, the remaining ones will not be displayed.</li>\n                <li>For the sake of simplicity, the states have not been subdivided to consider the type of devices created, deleted or modified.</li>\n                <li>This aggregation chart does not show final states.\n                    You can check the final state for each session in the session-specific version of this chart.</li>\n            </ul>\n        </div>\n    </div>\n\n    <div class=\"row\">\n        <div class=\"col-md-12\">\n            <div class=\"stateDiagram\" data=\"usage.data\" levels-to-show=\"usage.selectedLevels\"></div>\n        </div>\n    </div>\n</div>\n");}]);