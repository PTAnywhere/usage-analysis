<!DOCTYPE html>
<html ng-app="ptAnywhere.dashboard.summary.ibook" ngStrictDi>
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
    <#include "includes/libraries/nouislider.ftl">

    <link type="text/css" rel="stylesheet" href="${base}/static/css/dashboard.css">
    <script src="${dependencies}/angular-route.min.js"></script>
    <script src="${base}/static/js/dashboardApp.min.js"></script>
    <script>
        angular.module('ptAnywhere.dashboard').constant('baseUrl', '${base}');
    </script>
</head>
<body ng-controller="StaticUsageStatesController as usage">
    <div class="row">
        <div class="col-md-12" style="margin-top: 20px;">
            <p>Number of levels shown in the chart: <span ng-bind="usage.slidedLevels"></span>.</p>
            <div class="slider" ng-model="usage.selectedLevels" range-max="usage.maxLevels" on-slide="usage.onSlide(value)"></div>
        </div>
    </div>

    <div class="row">
        <div class="col-md-12">
            <div class="stateDiagram" data="usage.data" levels-to-show="usage.selectedLevels"></div>
        </div>
    </div>
</body>
</html>
