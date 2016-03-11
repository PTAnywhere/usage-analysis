<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="content-type" content="text/html; charset=UTF8">
    <title>PTAnywhere widget usage player</title>

    <#include "includes/libraries/commons.ftl">

    <#include "includes/libraries/vis.ftl">

    <#include "includes/libraries/slider.ftl">

    <#include "includes/libraries/moment.ftl">

    <#include "includes/libraries/vocabulary.ftl">

    <!-- PTAnywhere -->
    <link type="text/css" rel="stylesheet" href="${base}/static/bower_components/widget-ui/css/widget.css">
    <link type="text/css" rel="stylesheet" href="${base}/static/bower_components/widget-ui/css/console.css">
    <script type="text/javascript" src="${base}/static/bower_components/widget-ui/js/locale/en.js"></script>
    <script type="text/javascript" src="${base}/static/bower_components/widget-ui/js/widget.js"></script>

    <!-- Replayer -->
    <link rel="stylesheet" href="${base}/static/css/replayer.css">
    <script type="text/javascript" src="${base}/static/js/replayer.js"></script>
    <script type="text/javascript" src="${base}/static/data/base_map.js"></script>
    <script type="text/javascript">
        // Starts with (not yet supported by all browsers)
        String.prototype.startsWith = function(suffix) {
            return this.indexOf(suffix, 0) === 0;
        };

        function getId(url) {
            var els = url.split("/");
            var ret = els[els.length-1];
            if (ret.length!=0) return ret;
            return els[els.length-2];
        }

        function freezeReplayer(callAfterFreeze, callBeforeUnfreeze) {
            replayer.freeze();
            callAfterFreeze();

            var dialogAnimationTime = (replayer.getSpeed()==1)? 2000: 1000;
            setTimeout(function() {
                callBeforeUnfreeze();
                replayer.unfreeze();
            }, dialogAnimationTime);
        };

        $(function() {
            var htmlElements = {
                btnSpeedId: 'speed',
                btnPlayPauseId: 'playPause',
                btnStopId: 'stop',
                sdrTimelineId: 'timeline',
                eventLogId: 'event-log',
            };

            var widget = ptAnywhereWidgets.all.createNonInteractiveWidget('.widget',
                                                          '${base}/static/bower_components/widget-ui/images/',
                                                          data,
                                                          { sessionCreation: false,
                                                            backdrop: 'static',
                                                            dialogWrapper: '.dialogs',
                                                            backdropArea: '.widget'
                                                          });
            replayer.create('${base}/a/data/sessions/${sessionId}', htmlElements);
            replayer.onStop(widget.reset);
            replayer.onStatement(function(statement) {
                console.log(statement);
            });

            var listener = statements.newListener().
            onCreateDevice(function(dext) {
                var dId = getId(dext[extension.device.uri]);
                var baseDevice = { id: dId, group: dext[extension.device.type], label: dext[extension.device.name],
                                    x: dext[extension.device.position].x, y: dext[extension.device.position].y,
                                    url: dext[extension.device.uri] };
                if (extension.device.defaultGateway in dext) {
                    baseDevice.defaultGateway = dext[extension.device.defaultGateway];
                }
                widget.map.addNode(baseDevice);
                widget.map.fit();
            }).
            onCreateLink(function(dext) {
                var ends = dext[extension.endpoints];

                freezeReplayer(function() {
                    widget.dialogs.link.setFromDevice(ends[0].device);
                    widget.dialogs.link.setFromPorts([{portName: ends[0].port, portURL: ''}]);
                    widget.dialogs.link.setToDevice(ends[1].device);
                    widget.dialogs.link.setToPorts([{portName: ends[1].port, portURL: ''}]);
                    widget.dialogs.link.showLoaded();
                    widget.dialogs.link.open();
                }, function() {
                    widget.map.connect(ends[0].device, ends[1].device);
                    widget.dialogs.link.close();
                });
            }).
            onDeleteDevice(function(dext) {
                widget.map.removeNode(dext[extension.device.name]);
            }).
            onDeleteLink(function(dext) {
                var ends = dext[extension.endpoints];
                widget.map.disconnect([ ends[0].device, ends[1].device ]);
            }).
            onUpdateDevice(function(dext, response) {
                var originalName = dext[extension.device.name];
                var nodeToModify = widget.map.get(originalName);

                freezeReplayer(function() {
                    var originalName = dext[extension.device.name];
                    var nodeToModify = widget.map.get(originalName);

                    widget.dialogs.modification.selectFirstTab();
                    widget.dialogs.modification.setDeviceName(response);
                    nodeToModify.label = response;
                    if (nodeToModify.hasOwnProperty('defaultGateway')) {
                        widget.dialogs.modification.setDefaultGateway(dext[extension.device.defaultGateway]);
                    } else {
                        widget.dialogs.modification.setDefaultGateway(null);
                    }
                    widget.dialogs.modification.open();
                }, function() {
                    widget.map.updateNode(nodeToModify);
                    widget.dialogs.modification.close();
                });
            }).
            onUpdatePort(function(dext) {
                freezeReplayer(function() {
                    widget.dialogs.modification.selectSecondTab();
                    widget.dialogs.modification.setPorts([{portName: dext[extension.port.name], portURL: ''}]);
                    widget.dialogs.modification.setPortIpAddress(dext[extension.port.ipAddress]);
                    widget.dialogs.modification.setPortSubnetMask(dext[extension.port.subnetMask]);
                    widget.dialogs.modification.showLoaded();
                    widget.dialogs.modification.showIFaceDetails();
                    widget.dialogs.modification.open();
                }, function() {
                    var originalName = dext[extension.device.name];
                    var nodeToModify = widget.map.get(originalName);

                    widget.map.updateNode(nodeToModify);
                    widget.dialogs.modification.close();
                });
            }).
            onOpenCommandLine(function() {
                widget.dialogs.cmd.setBody('<div class="messages commandLine"></div>');
                widget.dialogs.cmd.open();
            }).
            onCloseCommandLine(function() {
                // An undesired effect can be seen when the open method is processed before the modal has
                // been properly been closed (it usually only happens when it is replayed at x16).
                // The following code will ensure that next event is processed ONLY after the dialog has been closed.

                replayer.freeze();
                widget.dialogs.cmd.selector.on('hidden.bs.modal', function (e) {
                    $(e.currentTarget).unbind();  // Unbind previous
                    replayer.unfreeze();
                });
                widget.dialogs.cmd.close();

                // TODO Make sure that it is closed when the simulation ends.
            }).
            onUseCommandLine(function(dext) {
                // Already echoed in read
                // widget.dialogs.cmd.appendTo('.messages', statement.result.response);
            }).
            onReadCommandLine(function(text) {
                widget.dialogs.cmd.appendTo('.messages', text);
                var cmdDiv = $('.commandLine');
                cmdDiv.scrollTop(cmdDiv[0].scrollHeight);
            });

            // TODO typing effects in dialogs
            replayer.onStatement(function(statement) {
                listener.onStatement(statement);
            });
        });
    </script>
</head>
<body>
    <div class="container">
        <#include "includes/breadcrumb.ftl">

        <h1>Replayer</h1>

        <div class="row" style="margin: 20px 0;">
            <div class="col-md-4">
                <fieldset>
                    <div class="row">
                        <div class="col-md-6">Session controls:</div>
                        <div class="col-md-6">
                            <button id="playPause">
                                  <span class="glyphicon glyphicon-play" aria-hidden="true"></span>
                            </button>
                            <button id="stop">
                                  <span class="glyphicon glyphicon-stop" aria-hidden="true"></span>
                            </button>
                            <button id="speed"></button>
                        </div>
                    </div>
                </fieldset>
            </div>
            <div class="col-md-8">
                  <div id="timeline"></div>
            </div>
        </div>

        <div class="row replaying-area">
            <div class="col-md-4">
                  <div id="event-log" class="well"></div>
            </div>
            <div class="col-md-8">
                  <div class="widget"></div>
                  <div class="dialogs"></div>
            </div>
        </div>

        <#include "includes/error_dialog.ftl">
    </div>
</body>
</html>