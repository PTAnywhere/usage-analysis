

var errorDialog = (function () {
  function init(message) {
      $('#errorDialog div.modal-body p').text(message);
      $('#errorDialog').modal('show')
      console.error(message);
  }
  return {
      open: init
  };
})();


var timeFilter = (function () {

    var displayDateFormat = 'MM/DD/YYYY HH:00';
    var startEl, endEl;

    function getStartDate() {
        return startEl.data("DateTimePicker").date();
    }

    function setStartDate(timeMoment) {
        startEl.data("DateTimePicker").date(moment('2016-01-27').startOf('day'));
    }

    function setEndDate(timeMoment) {
        endEl.data("DateTimePicker").date(moment('2016-01-28').endOf('day'));
    }

    function configure(startId, endId) {
        startEl = $('#' + startId);
        endEl = $('#' + endId);

        startEl.datetimepicker({
            format: displayDateFormat,
            useCurrent: false,
            defaultDate: moment().startOf('day'),
        });

        endEl.datetimepicker({
            format: displayDateFormat,
            useCurrent: false,
            defaultDate: moment().endOf('day'),
        });

        startEl.on('dp.change', function(e) {
            endEl.data("DateTimePicker").minDate(e.date.add(1, 'hours'));
        });

        endEl.on('dp.change', function(e) {
            var startDate = getStartDate();
            if (e.date<startDate) {
                endEl.data("DateTimePicker").date(startDate.add(1, 'days'));
            }
        });
    }

    function getURLParams() {
        var startISO = $('#startTime').data("DateTimePicker").date().toISOString();
        var endISO = $('#endTime').data("DateTimePicker").date().toISOString();
        return 'start=' + startISO +'&end=' + endISO;
    }

    return {
        configure: configure,
        setStartDate: setStartDate,
        setEndDate: setEndDate,
        getURLParameters: getURLParams,
    };
})();