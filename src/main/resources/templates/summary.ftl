<!DOCTYPE html>
<html ng-app="dashboardApp.summary">
<head>
    <meta http-equiv="content-type" content="text/html; charset=UTF8">
    <title>PT Anywhere widget usage: summary charts</title>

    <#include "includes/libraries/commons.ftl">

    <#include "includes/libraries/chart.ftl">

    <script type="text/javascript">
        function createLabels(steps) {
            var ret = [];
            for (var i=1; i<=steps; i++) {
                ret.push(i);
            }
            return ret;
        }

        function createChart(chartId, data) {
            var ctx = document.getElementById(chartId).getContext("2d");
            var data = {
                labels: createLabels(data.length),
                datasets: [
                    {
                        label: "Actions per session",
                        fillColor: "rgba(151,187,205,0.7)",
                        strokeColor: "rgba(151,187,205,0.8)",
                        highlightFill: "rgba(151,187,205,0.9)",
                        highlightStroke: "rgba(151,187,205,1)",
                        data: data
                    }
                ]
            };
            var options = {
                responsive: true,
                barShowStroke: false,
                barValueSpacing: 0,
                barValueSpacing: 0
            };
            return new Chart(ctx).Bar(data, options);
        }


        $(function() {
            $.getJSON('${base}/a/data/sessions/perStatements?' + queryParameter.all())
                .done(function(values) {
                    myBarChart.destroy();
                    myBarChart = createChart('myChart', values);
                });
            var fakeData = [65, 59, 80, 81, 56, 55, 40, 41];
            var myBarChart = createChart('myChart', fakeData);
        });
    </script>
    <script src="${base}/static/bower_components/angular-route/angular-route.min.js"></script>
    <script src="${base}/static/js/dashboard/summary-app.js"></script>
    <script src="${base}/static/js/dashboard/data-services.js"></script>
    <script src="${base}/static/js/dashboard/summary-controller.js"></script>
</head>
<body ng-controller="SummaryController as sum">
    <div class="container">
        <h1 ng-bind="sum.title"></h1>

        <div class="row" style="margin-top: 5%;">
          <canvas id="myChart" style="width: 100%; height: 400px;"></canvas>
        </div>
    </div>

    <div ng-view></div>
</body>
</html>
