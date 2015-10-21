/**
 * The Revealing Module Pattern.
 */
var replayer = (function () {

    var path;
    var cbSession;
    var speeds = [1, 2, 4, 8, 16];

    function init(apiPath, cbSessionId, btnSpeedId) {
        path = apiPath;
        cbSession = $('#' + cbSessionId);
        btnSpeed.create(btnSpeedId);
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
            console.log(registration);
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
            create: init,
            get: getSpeed
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