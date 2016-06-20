<!DOCTYPE html>
<html ng-app="dashboardApp.search">
<head>
    <meta http-equiv="content-type" content="text/html; charset=UTF8">
    <title>PT Anywhere usage analysis</title>

    <#include "includes/libraries/commons.ftl">
    <#include "includes/libraries/moment.ftl">
    <#include "includes/libraries/datetimepicker.ftl">

    <script src="${base}/static/js/dashboard/dist/dashboardApp.min.js"></script>
    <script>
        angular.module('dashboardApp').constant('baseUrl', '${base}');
    </script>
</head>
<body ng-controller="SearchController as find">

    <div class="container">
        <#include "includes/breadcrumb.ftl">

        <h1>PT Anywhere usage analysis</h1>

        <form ng-submit="find.list()">
            <fieldset>
                <legend>Sessions filter</legend>
                <div class="row form-group">
                    <div class="col-md-2 text-right">
                        <label for="startTime">Start: </label>
                    </div>
                    <div class="col-md-3">
                        <div id="startTime" class="input-group date" datetimepicker ng-model="find.startTime"
                            options="find.startTimeOptions" on-change="find.startTimeUpdate()">
                            <input type="text" class="form-control" />
                            <span class="input-group-addon">
                                <span class="glyphicon glyphicon-calendar"></span>
                            </span>
                        </div>
                    </div>

                    <div class="col-md-2 text-right">
                        <label for="endTime">End: </label>
                    </div>
                    <div class="col-md-3">
                        <div id="endTime" class="input-group date" datetimepicker ng-model="find.endTime"
                            options="find.endTimeOptions">
                            <input type="text" class="form-control" />
                            <span class="input-group-addon">
                                <span class="glyphicon glyphicon-calendar"></span>
                            </span>
                        </div>
                    </div>
                </div>

                <div class="row form-group">
                    <div class="col-md-2 text-right">
                        <label for="actionsNum">Minimum number of actions: </label>
                    </div>
                    <div class="col-md-3">
                        <input type="number" id="actionsNum" ng-model="find.actionsNum" min="1" step="1" value="1" />
                    </div>
                </div>

                <div class="row form-group">
                    <div class="col-md-2 text-right">
                        <label for="containsCommand">Contains command: </label>
                    </div>
                    <div class="col-md-3">
                        <input id="containsCommand" ng-model="find.containsCommand" placeholder="E.g. hostname *" />
                    </div>
                </div>

                <div class="row form-group">
                    <div class="col-md-12 text-center">
                        <span class="dropdown">
                            <button id="dLabel" class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Summarize <span class="caret"></span>
                            </button>
                            <ul class="dropdown-menu" aria-labelledby="dLabel">
                                <li><a ng-click="find.showStatesChart()">Usage steps</a></li>
                                <li><a ng-click="find.showSessionsStartedHistogram()">Sessions started</a></li>
                                <li><a ng-click="find.showInteractionCountingHistogram()">Activity volume</a></li>
                                <li><a ng-click="find.showInteractionCountingScatterplot()">Activity volume over time</a></li>
                            </ul>
                        </span>
                        <button type="submit" class="btn btn-primary">List sessions</button>
                    </div>
                </div>
            </fieldset>
        </form>

        <div class="row">
            <div class="col-md-12">
                <table class="table">
                    <thead>
                        <th colspan="2">Session</th>
                    </thead>
                    <tbody>
                        <tr ng-repeat="sessionId in find.sessions">
                            <td><a href="${base}/a/sessions/{{sessionId}}">{{sessionId | simpleUuid}}</a></td>
                            <td>
                                <a href="${base}/a/sessions/{{sessionId}}/usage.html">Show states</a><br/>
                                <a href="${base}/a/sessions/{{sessionId}}/replayer.html">Replay</a>
                            </td>
                        </tr>
                        <tr ng-if="find.sessions.length == 0">
                            <td colspan="2">No sessions match the search criteria.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <#include "includes/error_dialog.ftl">
    </div>
</body>
</html>
