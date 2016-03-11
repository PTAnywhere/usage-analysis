<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="content-type" content="text/html; charset=UTF8">
    <title>Widget usage diagram</title>

    <#include "includes/libraries/commons.ftl">

    <#include "includes/libraries/vis.ftl">

    <#include "includes/libraries/slider.ftl">

    <!-- Main state chart -->
    <style type="text/css">
        #networkMap {
            /*width: 800px;*/
            height: 500px;
            border: 1px solid lightgray;
        }

        #show-info {
            display: none;
            margin-top: 20px;
        }

        #slider-levels {
            margin: 0 0 30px 20px;
        }
    </style>

    <script type="text/javascript" src="${base}/static/js/chart.js"></script>
    <script type="text/javascript">
        $(function() {
            chart.create(3);
            <#if sessionId??>
            chart.load('${base}/a/data/usage/${sessionId}');
            <#else>
            chart.load('${base}/a/data/usage?' + queryParameter.all());
            </#if>
        });
    </script>
</head>

<body>
    <div class="container">
        <#include "includes/breadcrumb.ftl">

        <h1>PT Anywhere usage summary</h1>

        <div class="row">
            <div id="show-info" class="col-md-12">
                <p>Number of levels shown in the chart: <span class="number-levels"></span>.</p>
                <div id="slider-levels"></div>

                <p>Notes about the chart:</p>
                <ul>
                    <li>If a session has less than <span class="number-levels"></span> steps, NOOP state will be selected for the remaining levels.</li>
                    <li>If a session has more than <span class="number-levels"></span> steps, the remaining ones will be ignored.</li>
                    <li>There might not be final state if the session was not assessed.</li>
                    <li>The actions have not been divided to consider the type of devices created/deleted/modified to avoid too many states.</li>
                </ul>
            </div>
        </div>

        <div class="row">
            <div id="networkMap"></div>
        </div>

        <#include "includes/error_dialog.ftl">
    </div>
</body>
</html>

