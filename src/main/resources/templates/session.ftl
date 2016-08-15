<!DOCTYPE html>
<html ng-app="ptAnywhere.dashboard.session">
<head>
    <meta http-equiv="content-type" content="text/html; charset=UTF8">
    <title>PTAnywhere session viewer</title>

    <#include "includes/bundles/commons.ftl">
    <#include "includes/libraries/angular-route.ftl">
    <#include "includes/bundles/statesdiagram.ftl">

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
        angular.module('ptAnywhere.dashboard').constant('baseUrl', '${base}');
    </script>
</head>
<body ng-controller="SessionController as session">
    <div class="container">
        <nav class="navbar navbar-default">
            <div class="container-fluid">
                <div class="collapse navbar-collapse">
                    <div class="nav navbar-nav navbar-text">
                        <ol class="breadcrumb">
                            <li><a href="${base}/a/find.html">Home</a></li>
                            <li class="active">Session {{session.uiid | simpleUuid}}</li>
                        </ol>
                    </div>
                    <ul class="nav navbar-nav navbar-right">
                        <li class="dropdown">
                            <a class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Change chart <span class="caret"></span></a>
                            <ul class="dropdown-menu">
                                <li ng-repeat="vis in session.visualizations"><a href="{{ vis.url }}">{{ vis.name }}</a></li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>

        <div ng-view></div>
    </div>

    <#include "includes/footer.ftl">
</body>
</html>