<!DOCTYPE html>
<html ng-app="ptAnywhere.dashboard.summary.ibook" ngStrictDi>
<head>
    <meta http-equiv="content-type" content="text/html; charset=UTF8">
    <title>PT Anywhere widget usage: summary charts</title>

    <#include "includes/bundles/commons.ftl">
    <#include "includes/libraries/angular-route.ftl">
    <#include "includes/bundles/statesdiagram.ftl">

    <style>
        html, body {
            height: 100%;
        }

        .container-fluid {
            padding-top: 2%;
            padding-bottom: 2%;
        }

        .fill {
            height: 100%;
        }

        .slider-panel {
            height: 10%;
        }

        .map-panel {
            height: 90%;
            padding-top: 2%;
        }

        .map-panel .stateDiagram {
            height: 100%;
        }
    </style>
    <script src="${base}/static/js/dashboardApp.min.js"></script>
    <script>
        angular.module('ptAnywhere.dashboard').constant('baseUrl', '${base}');
    </script>
</head>
<body ng-controller="StaticUsageStatesController as usage">
    <div class="container-fluid fill">
        <div class="row slider-panel">
            <div class="col-md-offset-1 col-md-10 fill">
                <p>Number of levels shown in the chart: <span ng-bind="usage.slidedLevels"></span>.</p>
                <div class="slider" ng-model="usage.selectedLevels" range-max="usage.maxLevels" on-slide="usage.onSlide(value)"></div>
            </div>
        </div>

        <div class="row map-panel">
            <div class="col-md-12 fill">
                <div class="stateDiagram" data="usage.data" levels-to-show="usage.selectedLevels"></div>
            </div>
        </div>
    </div>
</body>
</html>
