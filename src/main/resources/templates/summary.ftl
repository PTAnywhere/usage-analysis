<!DOCTYPE html>
<html ng-app="dashboardApp.summary">
<head>
    <meta http-equiv="content-type" content="text/html; charset=UTF8">
    <title>PT Anywhere widget usage: summary charts</title>

    <#include "includes/libraries/commons.ftl">
    <#include "includes/libraries/moment.ftl">
    <#include "includes/libraries/chart.ftl">
    <!-- Only for scatterplot -->
    <#include "includes/libraries/vis.ftl">
    <#include "includes/libraries/vocabulary.ftl">

    <style>
    .breadcrumb {
        margin-bottom: 0;
        background-color: transparent;
        border-radius: 0;
        padding: 0;
    }
    </style>

    <script src="${base}/static/bower_components/angular-route/angular-route.min.js"></script>

    <script src="${base}/static/js/dashboard/app.js"></script>
    <script>
        angular.module('dashboardApp').constant('baseUrl', '${base}');
    </script>
    <script src="${base}/static/js/dashboard/filters.js"></script>
    <script src="${base}/static/js/dashboard/directives.js"></script>
    <script src="${base}/static/js/dashboard/services.js"></script>
    <script src="${base}/static/js/dashboard/summary/app.js"></script>
    <script src="${base}/static/js/dashboard/summary/controllers.js"></script>
</head>
<body ng-controller="SummaryController as sum">
    <div class="container" style="margin-top: 20px;">
        <nav class="navbar navbar-default">
          <div class="container-fluid">
            <ul class="nav navbar-nav">
              <li class="active">
                <ol class="breadcrumb navbar-text">
                    <li><a href="${base}/a/find.html">Home</a></li>
                    <li class="active">Summary</li>
                </ol>
            </li>
            </ul>
            <ul class="nav navbar-nav navbar-right">
              <li class="dropdown">
                <a class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Change chart <span class="caret"></span></a>
                <ul class="dropdown-menu">
                  <li ng-repeat="chart in sum.charts"><a href="{{ chart.url }}">{{ chart.name }}</a></li>
                </ul>
              </li>
            </ul>
          </div>
        </nav>

        <div ng-view></div>
    </div>
</body>
</html>
