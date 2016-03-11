<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="content-type" content="text/html; charset=UTF8">
    <title>PTAnywhere session viewer</title>

    <#include "includes/libraries/commons.ftl">

    <style type="text/css">
        .well {
            font: 10pt monospace, Helvetica, Arial;
            white-space: pre;
            background: white;
        }
    </style>

    <#include "includes/libraries/vocabulary.ftl">

    <!-- Listing -->
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

        $(function() {
            var cmdSessionNumber = 0;

            var listener = statements.newListener();
            listener.onCreateDevice(function(dext) {
                    $('#actions').append('<li>Creating ' + dext[extension.device.name] + '</li>');
                }).
                onCreateLink(function(dext) {
                    var ends = dext[extension.endpoints];
                    $('#actions').append('<li>Connecting ' + ends[0].device + ' and ' + ends[1].device + '</li>');
                }).
                onDeleteDevice(function(dext) {
                    $('#actions').append('<li>Deleting ' + dext[extension.device.name] + '</li>');
                }).
                onDeleteLink(function(dext) {
                    var ends = dext[extension.endpoints];
                    $('#actions').append('<li>Disconnecting ' + ends[0].device + ' and ' + ends[1].device + '</li>');
                }).
                onUpdateDevice(function(dext) {
                    $('#actions').append('<li>Updating ' + dext[extension.device.name] + '</li>');
                }).
                onUpdatePort(function(dext) {
                    $('#actions').append('<li>Updating ' + dext[extension.device.name] + '\'s port: ' + dext[extension.port.name] + '</li>');
                }).
                onOpenCommandLine(function(cmdName) {
                    cmdSessionNumber++;
                    var cmdSessionId = "collapsedSession" + cmdSessionNumber;
                    var html = '<li><a href="#' + cmdSessionId + '" data-toggle="collapse" ' +
                               'aria-expanded="false" aria-controls="' + cmdSessionId + '">' +
                               'Using ' + cmdName + '</a><div id="' + cmdSessionId + '" class="collapse">' +
                               '<div class="well"></div></div></li>';
                    $('#actions').append(html);
                }).
                onCloseCommandLine(function() {
                    //$('#actions').append('<li>Closed</li>');
                }).
                onUseCommandLine(function(dext) {
                    //$('#actions').append('<li>Use</li>');
                }).
                onReadCommandLine(function(response) {
                    var cmdSessionId = "collapsedSession" + cmdSessionNumber;
                    $('#' + cmdSessionId + ' .well').append(response);
                });

            $.getJSON('${base}/a/data/sessions/${sessionId}', function(registration) {
                for(var i=0; i<registration.statements.length; i++) {
                    listener.onStatement(registration.statements[i]);
                }
            }).fail(errorDialog.open);
        });
    </script>
</head>
<body>
    <div class="container">
        <#include "includes/breadcrumb.ftl">

        <h1>Session</h1>

        <div class="row" style="margin: 20px 0;">
            <div class="col-md-12">
                <ol id="actions"></ol>
            </div>
        </div>

        <div class="row form-group">
            <div class="col-md-12 text-center">
                <a href="usage.html" class="btn btn-default">State diagram</a>
                <a href="replayer.html" class="btn btn-default">Replayer</a>
            </div>
        </div>

        <#include "includes/error_dialog.ftl">
    </div>
</body>
</html>