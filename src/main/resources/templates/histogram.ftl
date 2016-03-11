<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="content-type" content="text/html; charset=UTF8">
    <title>PTAnywhere widget usage histogram</title>

    <#include "includes/libraries/commons.ftl">

    <#include "includes/libraries/moment.ftl">

    <#include "includes/libraries/chart.ftl">

    <script type="text/javascript">

        function createLabels(beginDate, steps) {
            var ret = [];
            for (var i=0; i<steps; i++) {
                ret.push(beginDate.format('MM/DD/YYYY HH'));
                beginDate.add(1, 'hours');
            }
            return ret;
        }

        function createChart(chartId, startTime, data) {
            var ctx = document.getElementById(chartId).getContext("2d");
            var data = {
                labels: createLabels(startTime, data.length),
                datasets: [
                    {
                        label: "Sessions started",
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
                scaleShowHorizontalLines: true,
                barValueSpacing: 0,
                barValueSpacing: 0
            };
            return new Chart(ctx).Bar(data, options);
        }


        $(function() {
            $.getJSON('${base}/a/data/sessions/counter?' + queryParameter.all())
                        .done(function(histogram) {
                            myBarChart.destroy();
                            var startTime = moment(histogram.start);
                            myBarChart = createChart('myChart', startTime, histogram.values);
                            console.log(histogram);
                        });
            var fakeData = [65, 59, 80, 81, 56, 55, 40, 41];
            var myBarChart = createChart('myChart', moment(), fakeData);
        });
    </script>
</head>
<body>
<div class="container">
    <#include "includes/breadcrumb.ftl">

    <h1>Sessions started</h1>

    <div class="row" style="margin-top: 5%;">
      <canvas id="myChart" style="width: 100%; height: 400px;"></canvas>
    </div>
</div>
</body>
</html>
