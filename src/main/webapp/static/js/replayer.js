/**
 * The Revealing Module Pattern.
 */
var replayer = (function () {

    var cbSession;
    var btnPlayPause, btnStop;
    var speeds = [1, 2, 4, 8, 16];

    function init(registrationUrl, htmlElements) {
        btnPlayPause = $('#' + htmlElements.btnPlayPauseId);
        btnStop = $('#' + htmlElements.btnStopId);

        timeSlider.init(htmlElements.sdrTimelineId);
        eventLog.init(htmlElements.eventLogId, 4);
        btnSpeed.init(htmlElements.btnSpeedId);

        loadRegistration(registrationUrl);
        btnSpeed.click(function() {
            timeline.setSpeed(btnSpeed.get());
        });
        btnPlayPause.click(function() {
            if ( $('span', btnPlayPause).hasClass('glyphicon-play') ) {
                setPlayPauseIcon(false);
                timeline.play();
                btnStop.show();
            } else {
                setPlayPauseIcon(true);
                timeline.pause();
            }
        });
        onStop(stop);

        timeline.onStatement(function(statement) {
            eventLog.add(printable(statement));
        });
    }

    function onStop(callback) {
        btnStop.click(callback);
    }

    function stop() {
        setPlayPauseIcon(true);
        timeline.stop();
        eventLog.clear();
        btnStop.hide();
    }

    function setPlayPauseIcon(isPlay) {
        var span = $('span', btnPlayPause);
        var classToSet = (isPlay)? 'glyphicon-play': 'glyphicon-pause';
        var classToUnset = (isPlay)? 'glyphicon-pause': 'glyphicon-play';
        span.removeClass(classToUnset);
        span.addClass(classToSet);
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

    function loadRegistration(registrationUrl) {
        $.getJSON(registrationUrl, function(registration) {
            timeline.set(registration.statements);
            timeline.stop();
            /*timeline.play(btnSpeed.get(), function(statement) {
                                            eventLog.add(printable(statement));
                                            console.log(statement);
            });*/
        }).fail(errorDialog.open);;
    }

    function disableControls() {
        btnPlayPause.attr('disabled', 'disabled');
        btnStop.attr('disabled', 'disabled');
        btnSpeed.disable();
    }

    function enableControls() {
        btnPlayPause.removeAttr('disabled');
        btnStop.removeAttr('disabled');
        btnSpeed.enable();
    }

    function freeze() {
        disableControls();
        timeline.pause();
    }

    function unfreeze() {
        enableControls();
        timeline.play();
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

        function click(callback) {
            btnSpeed.click(callback);  // Additional callback to the one set in 'init'.
        }

        function getSpeed() {
            return speeds[btnSpeed.val()];
        }

        function enable() {
            btnSpeed.removeAttr('disabled');
        }

        function disable() {
            btnSpeed.attr('disabled', 'disabled');
        }

        return {
            init: init,
            get: getSpeed,
            click: click,
            enable: enable,
            disable: disable,
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
            //firstLine.show('slide', {}, 500);
            firstLine.show('slide');
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
        var elStart, elEnd, elProgressBar, elSrOnly;
        var minimum, maximum, currentValue;

        function getPercentageProgress() {
            var percent = 0.0;
            if (maximum !== minimum) { // Otherwise division by zero...
                percent = (currentValue - minimum).toFixed(1) / (maximum - minimum).toFixed(1) * 100.0;
            }
            return Math.round(percent * 100)/100 + "%";  // Rounds to two decimals
        }

        function updateProgress() {
            var progress = getPercentageProgress();
            elSrOnly.text(progress + " complete");
            elProgressBar.width(progress);
        }

        function init(sdrTimelineId) {
            minimum = 0;
            maximum = 0;
            currentValue = 0;
            var sliderDiv = $('#' + sdrTimelineId);  // 1st version: not editable
            sliderDiv.append('<div class="time"><span class="start">-</span> / <span class="end">-</span></div>');
            sliderDiv.append('<div class="progress">' +
                             '<div class="progress-bar" role="progressbar" aria-valuenow="0"' +
                             'aria-valuemin="0" aria-valuemax="0" style="width:0%">'+
                             '<span class="sr-only"></span></div></div>');
            elStart = $('.start', sliderDiv);
            elEnd = $('.end', sliderDiv);
            elProgressBar = $('.progress-bar', sliderDiv);
            elSrOnly = $('.sr-only', sliderDiv);
        }

        function printTime(timestamp) {
            var relative = new Date(timestamp - min());
            var secs = relative.getSeconds();
            return relative.getMinutes() + ':' + ((secs<=9)? '0' + secs: secs);
        }

        function min(value) {
            if (typeof value === 'undefined') return minimum; // getter
            else { // setter
                minimum = value;
                elProgressBar.attr('aria-valuemin', minimum);
            }
        }

        function max(value) {
            if (typeof value === 'undefined') return maximum; // getter
            else { // setter
                maximum = value;
                elProgressBar.attr('aria-valuemax', maximum);
                elEnd.text(printTime(value));
                updateProgress();
            }
        }

        function val(value) {
            if (typeof value === 'undefined') return currentValue; // getter
            else { // setter
                currentValue = value;
                elProgressBar.attr('aria-valuenow', currentValue);
                elStart.text(printTime(value));
                updateProgress();
            }
        }

        function reset() {
            val(min());
        }

        return {
            init: init,
            min: min,
            max: max,
            value: val,
            reset: reset,
        };
    })();

    var timeline = (function () {
        var millisPerStep = 1000;
        var updateCallbacks = [];
        var stmtIndex;
        var statements;
        var isPaused;

        function setStatements(stmts) {
            statements = stmts;
            // TODO check if statements is empty
            var start = new Date(statements[0].timestamp);
            var end = new Date(statements[statements.length-1].timestamp);
            timeSlider.min(start.getTime());
            timeSlider.max(end.getTime());
            stop();
        }

        function getCurrentEventTimestamp() {
            if (stmtIndex >= statements.length)  return null;
            return new Date(statements[stmtIndex].timestamp).getTime();
        }

        /**
         * Dispatch statements which happened until 'timestamp' (included).
         *
         * It might dispatch more than an event and a latter call to pause() will not affect this.
         */
        function dispatchEventsUntil(timestamp) {
            var nextEventTime = getCurrentEventTimestamp();
            while (nextEventTime!=null && nextEventTime<=timestamp) {  // Process and move to next
                for(var i in updateCallbacks) {
                    updateCallbacks[i](statements[stmtIndex]);
                }
                stmtIndex++;
                nextEventTime = getCurrentEventTimestamp();
            }
        }

        function updateSlider() {  // Updates slider every second
            if (isPaused) {
                console.log('Timeline paused.');
            } else {
                // One step == A real interaction second
                var next = timeSlider.value() + 1000;
                var max = timeSlider.max();
                if (next > max) {
                    timeSlider.value(max);
                    dispatchEventsUntil(max);
                    //console.log('Nothing else to update');
                } else {
                    timeSlider.value(next);
                    dispatchEventsUntil(next);
                    setTimeout(updateSlider, millisPerStep);
                }
            }
        }

        function setSpeed(speed) {
            // x1 1000ms per step, x2 500ms per step, etc.
            millisPerStep = 1000.0 / speed;
        }

        function getSpeed() {
            // x1 1000ms per step, x2 500ms per step, etc.
            return Math.round(1000.0 / millisPerStep);
        }

        function addUpdateCallback(callback) {
            updateCallbacks.push(callback);
        }

        function stop() {
            isPaused = true;
            stmtIndex = 0;
            timeSlider.reset();
        }

        function playPause() {
            isPaused = !isPaused;
            if (!isPaused) {  // Resume
                updateSlider();
            }
        }

        return {
            set: setStatements,
            setSpeed: setSpeed,
            getSpeed: getSpeed,
            play: playPause,
            stop: stop,
            pause: playPause,
            onStatement: addUpdateCallback,
        };
    })();

    return {
        create: init,
        freeze: freeze,
        unfreeze: unfreeze,
        onStatement: timeline.onStatement,
        onStop: onStop,
        getSpeed: timeline.getSpeed,
    };

})();