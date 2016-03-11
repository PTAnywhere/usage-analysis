<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Sessions Scatterplot</title>

    <#include "includes/libraries/commons.ftl">

    <#include "includes/libraries/vis.ftl">

    <#include "includes/libraries/moment.ftl">

    <#include "includes/libraries/vocabulary.ftl">

    <script type="text/javascript">
        $(function() {
            $.getJSON('${base}/a/data/sessions/scatterplot?' + queryParameter.all())
                            .done(function(items) {
                                if (items.length==0) {
                                    $('#results').append('<tr><td colspan="3">No sessions recorded during the specified period.</td></tr>' );
                                } else {
                                    for (var i=0; i<items.length; i++) {
                                        $('#results').append('<tr><td><a href="${base}/a/sessions/' + items[i].label + '">' + items[i].label + '</a></td>' +
                                                             '<td>' + items[i].x + '</td>' +
                                                             '<td>' + items[i].y + '</td></tr>');
                                    }

                                    for(var i=0; i<items.length; i++) {
                                        items[i].x = moment(items[i].x);
                                        // I don't like the way they look inline.
                                        // items[i].label = { content: items[i].label };
                                    }

                                    var container = document.getElementById('visualization');
                                    var dataset = new vis.DataSet(items);
                                    var options = {
                                          sort: false,
                                          sampling:false,
                                          style:'points',
                                          dataAxis: {
                                              showMinorLabels: false,
                                              left: {
                                                    title: { text: 'Number of interactions' }
                                              },
                                              right: {
                                                    title: { text: 'Session starting time' }
                                              }
                                          },
                                          drawPoints: {
                                              enabled: true,
                                              size: 6,
                                              style: 'circle' // square, circle
                                          },
                                          defaultGroup: 'Scatterplot'
                                    };
                                    var graph2d = new vis.Graph2d(container, dataset, options);
                                }
                            });
        });
    </script>
</head>
<body>
    <div class="container">
        <#include "includes/breadcrumb.ftl">

        <h1>Sessions per number of activities and time</h1>

        <div class="row" style="margin-top: 5%;">
            <div id="visualization"></div>
        </div>

        <div class="row" style="margin-top: 30px;">
            <div class="col-md-12">
                <table class="table">
                    <thead>
                    <th>Session</th><th>Started at</th><th>Number of interactions</th>
                    </thead>
                    <tbody id="results">
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</body>
</html>