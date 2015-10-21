/**
 * The Revealing Module Pattern.
 */
var replayer = (function () {

    var path;
    var cbSession;
    var speeds = [1, 2, 4, 8, 16];

    function init(apiPath, cbSessionId, btnSpeedId, btnPlayId, sdrTimelineId) {
        path = apiPath;
        cbSession = $('#' + cbSessionId);
        btnSpeed.init(btnSpeedId);
        timeline.init(sdrTimelineId);
        $('#' + btnPlayId).click(function() {
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

    function loadRegistration(regId) {
        $.getJSON(path + '/' + regId, function(registration) {
            timeline.set(registration.statements);
            timeline.play(btnSpeed.get());
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

    var timeline = (function () {
        var slider = (function () {
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
                return relative.getMinutes() + ':' + ((secs<9)? '0' + secs: secs);
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

        var stmts;
        var stepsPerSecond;

        function setStatements(statements) {
            // TODO check if statements is empty
            var start = new Date(statements[0].timestamp);
            var end = new Date(statements[statements.length-1].timestamp);
            startTime = start.getTime();
            slider.min(startTime);
            slider.max(end.getTime());
            slider.value(startTime);
        }

        function updateSlider() {
            var next = slider.value() + stepsPerSecond;
            var max = slider.max();
            if (next > max) {
                slider.value(max);
                //console.log('Nothing else to update');
            } else {
                slider.value(next);
                setTimeout(updateSlider, 1000);
            }
        }

        function play(startingAt, speed) {
            stepsPerSecond = speed * 1000;  // x1 1 second each second, x2 2 seconds every second, etc.
            slider.value(startTime);
            setTimeout(updateSlider, 1000);  // Updates slider every second
        }

        function playFromBeginning(speed) {
            play(0, speed);
        }

        return {
            init: slider.init,
            set: setStatements,
            play: playFromBeginning
        };
    })();

    return {
        create: init,
        load: loadRegistration
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