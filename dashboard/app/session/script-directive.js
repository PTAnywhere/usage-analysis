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