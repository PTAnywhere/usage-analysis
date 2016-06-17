<!DOCTYPE html>
<html ng-app="dashboardApp.session">
<head>
    <meta http-equiv="content-type" content="text/html; charset=UTF8">
    <title>Widget usage diagram</title>

    <#include "includes/libraries/commons.ftl">
    <#include "includes/libraries/vis.ftl">
    <#include "includes/libraries/slider.ftl">

    <!-- Main state chart -->
    <style type="text/css">
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
    <script src="${base}/static/js/dashboard/app/directives.js"></script>
    <script src="${base}/static/js/dashboard/app/services.js"></script>
    <script src="${base}/static/js/dashboard/app/session/controllers.js"></script>
</head>

<body ng-controller="UsageStatesController as usage">
    <div class="container">
        <#include "includes/breadcrumb.ftl">

        <h1>PT Anywhere usage summary</h1>

        <div class="row">
            <div class="col-md-12" style="margin-top: 20px;">
                <p>Number of levels shown in the chart: <span ng-bind="usage.slidedLevels"></span>.</p>
                <div class="slider" slider-max="usage.maxLevels" on-slide="usage.onSlide(value)" on-change="usage.onChange(value)"></div>

                <p>Notes to interpret the chart:</p>
                <ul>
                    <li>If a session has less than <span ng-bind="usage.slidedLevels"></span> steps, NOOP state will be selected for the remaining levels.</li>
                    <li>If a session has more than <span ng-bind="usage.slidedLevels"></span> steps, the remaining ones will be ignored.</li>
                    <li>There might not be final state if the session was not assessed.</li>
                    <li>The actions have not been divided to consider the type of devices created/deleted/modified to avoid too many states.</li>
                </ul>
            </div>
        </div>

        <div class="row">
            <div class="stateDiagram" data="usage.data" levels-to-show="usage.levels"></div>
        </div>
    </div>
</body>
</html>

