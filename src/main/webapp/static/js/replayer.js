/**
 * The Revealing Module Pattern.
 */
var replayer = (function () {

    var path;
    var cbSession;
    var speeds = [1, 2, 4, 8, 16];

    function init(apiPath, cbSessionId, btnSpeedId, btnPlayId, sdrTimelineId, eventLogId) {
        path = apiPath;
        cbSession = $('#' + cbSessionId);
        btnSpeed.init(btnSpeedId);
        timeSlider.init(sdrTimelineId);
        eventLog.init(eventLogId, 4);
        $('#' + btnPlayId).click(function() {
            eventLog.clear();
            loadRegistration(cbSession.val());
        });
        loadRegistrations();
    }

    function loadRegistrations() {
        $.getJSON(path, function(registrations) {
            for (var i=0; i<registrations.length; i++) {
                cbSession.append('<option value="' + registrations[i] + '">'  + i + '</option>');
            }
        }, function(error) {
            errorDialog.open(error);
        });
    }

    function printable(statement) {
        var pieces = statement.verb.id.split('/');
        var verb = pieces[pieces.length-1];
        var object = statement.object.id;
        if ('definition' in statement.object) {
            if ('name' in statement.object.definition) {
                object = statement.object.definition.name['en-GB'];
            }
        }
        return verb + ' ' + object;
    }

    function loadRegistration(regId) {
        $.getJSON(path + '/' + regId, function(registration) {
            timeline.set(registration.statements);
            timeline.play(btnSpeed.get(), function(statement) {
                                            eventLog.add(printable(statement));
                                            console.log(statement);
            });
        }, function(error) {
            errorDialog.open(error);
        });
    }

    var btnSpeed = (function () {
        var speeds = [1, 2, 4, 8, 16];
        var btnSpeed;

        function init(btnSpeedId) {
            btnSpeed = $('#' + btnSpeedId);
            setSpeed(0);
            btnSpeed.click(next);
        }

        function setSpeed(position) {
            btnSpeed.val(position);
            btnSpeed.text('x' + speeds[position]);
        }

        function next() {
            var current = parseInt(btnSpeed.val());
            if (current==speeds.length-1) {
                setSpeed(0);
            } else {
                setSpeed(current+1);
            }
        }

        function getSpeed() {
            return speeds[btnSpeed.val()];
        }

        return {
            init: init,
            get: getSpeed
        };
    })();

    var eventLog = (function () {
        var firstLine, restLines, numLines;

        function init(eventLogId, linesToShow) {
            numLines = linesToShow;
            var logDiv = $('#' + eventLogId);
            logDiv.append('<p class="first"></p><span class="rest"></span>');
            firstLine = $('.first', logDiv);
            restLines = $('.rest', logDiv);
        }

        function addLine(line) {
            firstLine.hide();
            restLines.prepend('<p>' + firstLine.text() + '</p>');
            firstLine.text(line);
            firstLine.show('slide', {}, 500);
        }

        function clearLines() {
            firstLine.text('');
            restLines.text('');
        }

        return {
            init: init,
            add: addLine,
            clear: clearLines,
        };
    })();

    // If in the final version the user cannot move it, it might be better (more clear) to use a Progressbar.
    var timeSlider = (function () {
        /**
         * A module containing a slider and start and ending labels expressed in "mm:ss".
         */
        var elSlider, elStart, elEnd;

        function init(sdrTimelineId) {
            var sliderDiv = $('#' + sdrTimelineId);  // 1st version: not editable
            sliderDiv.append('<span class="start">-</span>');
            sliderDiv.append('<span class="slider">-</span>');
            sliderDiv.append('<span class="end">-</span>');
            elSlider = $('.slider', sliderDiv);
            elStart = $('.start', sliderDiv);
            elEnd = $('.end', sliderDiv);
            elSlider.slider({
                range: "min",
                slide: function( event, ui ) {
                    // do nothing
                    return false;
                }
            });
        }

        function printTime(timestamp) {
            var relative = new Date(timestamp - min());
            var secs = relative.getSeconds();
            return relative.getMinutes() + ':' + ((secs<=9)? '0' + secs: secs);
        }

        function min(value) {
            if (typeof value === 'undefined')
                return elSlider.slider('option', 'min'); // getter
            else elSlider.slider('option', 'min', value);  // setter
        }

        function max(value) {
            if (typeof value === 'undefined')
                return elSlider.slider('option', 'max'); // getter
            else {
                elSlider.slider('option', 'max', value);  // setter
                elEnd.text(printTime(value));
            }
        }

        function val(value) {
            if (typeof value === 'undefined')
                return elSlider.slider('value'); // getter
            else {
                elSlider.slider('value', value);  // setter
                elStart.text(printTime(value));
            }
        }

        return {
            init: init,
            min: min,
            max: max,
            value: val,
        };
    })();

    var timeline = (function () {
        var stmtIndex;
        var statements;
        var stepsPerSecond;

        function setStatements(stmts) {
            // TODO check if statements is empty
            statements = stmts;
            var start = new Date(statements[0].timestamp);
            var end = new Date(statements[statements.length-1].timestamp);
            startTime = start.getTime();
            timeSlider.min(startTime);
            timeSlider.max(end.getTime());
            timeSlider.value(startTime);
        }

        function getCurrentEventTimestamp() {
            if (stmtIndex >= statements.length)  return null;
            return new Date(statements[stmtIndex].timestamp).getTime();
        }

        /**
         * Dispatch statements which happened until 'timestamp' (included).
         */
        function dispatchEventsUntil(timestamp, callback) {
            var nextEventTime = getCurrentEventTimestamp();
            while (nextEventTime!=null && nextEventTime<=timestamp) {  // Process and move to next
                callback(statements[stmtIndex]);
                stmtIndex++;
                nextEventTime = getCurrentEventTimestamp();
            }

        }

        function updateSlider(callback) {
            var next = timeSlider.value() + stepsPerSecond;
            var max = timeSlider.max();
            if (next > max) {
                timeSlider.value(max);
                dispatchEventsUntil(max, callback);
                //console.log('Nothing else to update');
            } else {
                timeSlider.value(next);
                dispatchEventsUntil(next, callback);
                setTimeout(updateSlider, 1000, callback);
            }
        }

        function play(startingAt, speed, callback) {
            stepsPerSecond = speed * 1000;  // x1 1 second each second, x2 2 seconds every second, etc.
            timeSlider.value(startTime);
            stmtIndex = 0;
            setTimeout(updateSlider, 1000, callback);  // Updates slider every second
        }

        function playFromBeginning(speed, callback) {
            play(0, speed, callback);
        }

        return {
            set: setStatements,
            play: playFromBeginning
        };
    })();

    return {
        create: init,
        load: loadRegistration,
    };

})();

var errorDialog = (function () {
  function init(message) {
      $( "#error-dialog p" ).text(message);
      $( "#error-dialog" ).dialog({
        modal: true,
        buttons: {
          Ok: function() {
            $( this ).dialog( "close" );
          }
        }
      });
      console.error(message);
  }
  return {
      open: init
  };
})();