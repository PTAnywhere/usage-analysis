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

    <script src="${dependencies}/angular-route.min.js"></script>

    <script src="${base}/static/js/dashboardApp.min.js"></script>
    <script>
        angular.module('dashboardApp').constant('baseUrl', '${base}');
    </script>
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
                    <li>If a session has more than <span ng-bind="usage.slidedLevels"></span> steps, the remaining ones are now displayed.</li>
                    <li>The actions have not been divided to consider the type of devices created/deleted/modified to avoid too many states.</li>
                    <li ng-show="usage.slidedLevels == usage.maxLevels">
                        The final state is based on the solution for the experimentation session carried out in January.
                        Note that the user of this session might have been using the widget with other purpose.</li>
                    <li ng-show="usage.slidedLevels < usage.maxLevels">To avoid confusions, the final state transition is only shown if all the levels are displayed.</li>
                </ul>
            </div>
        </div>

        <div class="row">
            <div class="stateDiagram" final-displayed="true" data="usage.data" levels-to-show="usage.levels"></div>
        </div>
    </div>
</body>
</html>

