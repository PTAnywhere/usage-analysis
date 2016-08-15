<!DOCTYPE html>
<html ng-app="ptAnywhere.dashboard.summary" ngStrictDi>
<head>
    <meta http-equiv="content-type" content="text/html; charset=UTF8">
    <title>PT Anywhere widget usage: summary charts</title>

    <#include "includes/bundles/commons.ftl">
    <#include "includes/libraries/angular-route.ftl">
    <#include "includes/libraries/chart.ftl">
    <#include "includes/bundles/scatterplot.ftl">
    <#include "includes/bundles/statesdiagram.ftl">

    <script src="${base}/static/js/dashboardApp.min.js"></script>
    <script>
        angular.module('ptAnywhere.dashboard').constant('baseUrl', '${base}');
    </script>
</head>
<body ng-controller="SummaryController as sum">
    <div class="container">
        <nav class="navbar navbar-default">
            <div class="container-fluid">
                <div class="collapse navbar-collapse">
                    <div class="nav navbar-nav navbar-text">
                        <ol class="breadcrumb">
                            <li><a href="${base}/a/find.html">Home</a></li>
                            <li class="active">Summary</li>
                        </ol>
                    </div>
                </div>
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

    <#include "includes/footer.ftl">
</body>
</html>
