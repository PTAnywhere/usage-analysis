<!DOCTYPE html>
<html ng-app="ptAnywhere.dashboard.session">
<head>
    <meta http-equiv="content-type" content="text/html; charset=UTF8">
    <title>PTAnywhere session viewer</title>

    <#include "includes/libraries/commons.ftl">
    <#include "includes/libraries/vis.ftl">
    <#include "includes/libraries/slider.ftl">

    <style type="text/css">
        .well {
            font: 10pt monospace, Helvetica, Arial;
            white-space: pre;
            background: white;
        }
    </style>

    <#include "includes/libraries/vocabulary.ftl">

    <link type="text/css" rel="stylesheet" href="${base}/static/css/dashboard.css">
    <script src="${dependencies}/angular-route.min.js"></script>
    <script src="${base}/static/js/dashboardApp.min.js"></script>
    <script>
        angular.module('ptAnywhere.dashboard').constant('baseUrl', '${base}');
    </script>
</head>
<body ng-controller="SessionController as session">
    <div class="container" style="margin-top: 20px;">
        <nav class="navbar navbar-default">
          <div class="container-fluid">
            <ul class="nav navbar-nav">
              <li class="active">
                <ol class="breadcrumb navbar-text">
                    <li><a href="${base}/a/find.html">Home</a></li>
                    <li>Session</li>
                    <li class="active">{{session.uiid | simpleUuid}}</li>
                </ol>
            </li>
            </ul>
            <ul class="nav navbar-nav navbar-right">
              <li class="dropdown">
                <a class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Change chart <span class="caret"></span></a>
                <ul class="dropdown-menu">
                  <li ng-repeat="vis in session.visualizations"><a href="{{ vis.url }}">{{ vis.name }}</a></li>
                </ul>
              </li>
            </ul>
          </div>
        </nav>

        <div ng-view></div>
    </div>
</body>
</html>