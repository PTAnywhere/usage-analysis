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
    <!-- Only for state diagram -->
    <#include "includes/libraries/slider.ftl">

    <style type="text/css">
        .breadcrumb {
            margin-bottom: 0;
            background-color: transparent;
            border-radius: 0;
            padding: 0;
        }
        /* State diagram */
        .slider {
            margin: 0 0 30px 20px;
        }
        .stateDiagram {
            height: 500px;
            border: 1px solid lightgray;
        }
        .stateDiagram > div {
            width: 100%;
            height: 100%;
        }
    </style>

    <script src="${base}/static/bower_components/angular-route/angular-route.min.js"></script>

    <script src="${base}/static/js/dashboard/app/app.js"></script>
    <script>
        angular.module('dashboardApp').constant('baseUrl', '${base}');
    </script>
    <script src="${base}/static/js/dashboard/app/filters.js"></script>
    <script src="${base}/static/js/dashboard/app/directives.js"></script>
    <script src="${base}/static/js/dashboard/app/services.js"></script>
    <script src="${base}/static/js/dashboard/app/summary/app.js"></script>
    <script src="${base}/static/js/dashboard/app/summary/controllers.js"></script>
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
