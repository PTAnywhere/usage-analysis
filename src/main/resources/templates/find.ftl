<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="content-type" content="text/html; charset=UTF8">
    <title>PT Anywhere usage analysis</title>

    <#include "includes/libraries/commons.ftl">

    <#include "includes/libraries/moment.ftl">

    <#include "includes/libraries/dateTimePicker.ftl">

    <script type="text/javascript">
        function getParams() {
            return '?' + timeFilter.getURLParameters() + '&minStatements=' + $('#actionsNum').val();
        }

        $(function() {
            timeFilter.configure('startTime', 'endTime');

            $('#btnStates').click(function() {
                window.location.href = 'summaries/states.html' + getParams();
            });

            $('#btnTimeHistogram').click(function() {
                window.location.href = 'summaries/sessions_started.html' + getParams();
            });

            $('#btnInteractionCountingHistogram').click(function() {
                window.location.href = 'summaries/activity.html' + getParams();
            });

            $('#btnInteractionCountingScatterplot').click(function() {
                window.location.href = 'summaries/activity_time.html' + getParams();
            });


            $('#btnSessions').click(function() {
                $.getJSON('${base}/a/data/sessions' + getParams())
                    .done(function(registrations) {
                        $('#results').empty();
                        if (registrations.length==0) {
                            $('#results').append('<tr><td colspan="2">No sessions match the search criteria.</td></tr>' );
                        } else {
                            for (var i=0; i<registrations.length; i++) {
                                $('#results').append('<tr><td><a href="sessions/' + registrations[i] + '">' + registrations[i] + '</td><td>' +
                                                     '<a href="sessions/' + registrations[i] + '/usage.html">Show states</a><br>' +
                                                     '<a href="sessions/' + registrations[i] + '/replayer.html">Replay</a>' +
                                                     '</td></tr>');
                            }
                        }
                    })
                    .fail(errorDialog.open);
            });
        });
    </script>
</head>
<body>
    <div class="container">
        <#include "includes/breadcrumb.ftl">

        <h1>PT Anywhere usage analysis</h1>

        <fieldset>
            <legend>Sessions filter</legend>
            <div class="row form-group">
                <div class="col-md-2 text-right">
                    <label for="startTime">Start: </label>
                </div>
                <div class="col-md-3">
                    <div class="input-group date" id="startTime">
                        <input type="text" class="form-control" />
                        <span class="input-group-addon">
                            <span class="glyphicon glyphicon-calendar"></span>
                        </span>
                    </div>
                </div>
                <div class="col-md-2 text-right">
                    <label for="endTime">Finish: </label>
                </div>
                <div class="col-md-3">
                    <div class="input-group date" id="endTime">
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
                    <input type="number" id="actionsNum" min="1" step="1" value="1" />
                </div>
            </div>

            <div class="row form-group">
                <div class="col-md-12 text-center">
                    <span class="dropdown">
                        <button id="dLabel" class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Summarize <span class="caret"></span>
                        </button>
                        <ul class="dropdown-menu" aria-labelledby="dLabel">
                            <li id="btnStates"><a href="#">Usage steps</a></li>
                            <li id="btnTimeHistogram"><a href="#">Sessions started</a></li>
                            <li id="btnInteractionCountingHistogram"><a href="#">Activity volume</a></li>
                            <li id="btnInteractionCountingScatterplot"><a href="#">Activity volume over time</a></li>
                        </ul>
                    </span>
                    <button type="button" class="btn btn-primary" id="btnSessions">List sessions</button>
                </div>
            </div>
        </fieldset>

        <div class="row">
            <div class="col-md-12">
                <table class="table">
                    <thead>
                        <th colspan="2">Session</th>
                    </thead>
                    <tbody id="results">
                    </tbody>
                </table>
            </div>
        </div>

        <#include "includes/error_dialog.ftl">
    </div>
</body>
</html>
