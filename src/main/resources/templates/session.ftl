<!DOCTYPE html>
<html ng-app="dashboardApp.script">
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

    <script src="${base}/static/js/dashboardApp.min.js"></script>
    <script>
        angular.module('dashboardApp').constant('baseUrl', '${base}');
    </script>
</head>
<body ng-controller="ScriptController as script">
    <div class="container">
        <#include "includes/breadcrumb.ftl">

        <h1>Session</h1>

        <div class="row" style="margin: 20px 0;">
            <div class="col-md-12">
                <div class="sessionScript" statements="script.statements"></div>
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