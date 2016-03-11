var timeFilter = (function () {

    var displayDateFormat = 'MM/DD/YYYY HH:00';
    var startEl, endEl;

    function getEndDate() {
        return endEl.data("DateTimePicker").date();
    }

    function setStartDate(timeMoment) {
        startEl.data("DateTimePicker").date(timeMoment);
    }

    function setEndDate(timeMoment) {
        endEl.data("DateTimePicker").date(timeMoment);
    }

    function setMinEndDate(timeMoment) {
        var minMoment = timeMoment.add(1, 'hours');

        endEl.data("DateTimePicker").minDate(minMoment);
        if (getEndDate() < minMoment) {
            setEndDate(minMoment);
        }
    }

    function configure(startId, endId) {
        startEl = $('#' + startId);
        endEl = $('#' + endId);

        startEl.datetimepicker({
            format: displayDateFormat,
            useCurrent: false,
            defaultDate: getDefaultStart(),
        });

        endEl.datetimepicker({
            format: displayDateFormat,
            useCurrent: false,
            defaultDate: getDefaultEnd(),
        });

        startEl.on('dp.change', function(e) {
            setMinEndDate(e.date);
        });
    }

    function getDefaultStart() {
        var date = localStorage.getItem('startISO');
        if (date==null) {
            return moment().startOf('day');
        }
        return moment(date);
    }

    function getDefaultEnd() {
        var date = localStorage.getItem('endISO');
        if (date==null) {
            return moment().endOf('day');
        }
        return moment(date);
    }

    function storeLocally(startDateISO, endDateISO) {
        // For convenience, but it is not really important if it doesn't work.
        localStorage.setItem('startISO', startDateISO);
        localStorage.setItem('endISO', endDateISO);
    }

    function getURLParams() {
        var startISO = $('#startTime').data("DateTimePicker").date().toISOString();
        var endISO = $('#endTime').data("DateTimePicker").date().toISOString();
        storeLocally(startISO, endISO);
        return 'start=' + startISO +'&end=' + endISO;
    }

    return {
        configure: configure,
        setStartDate: setStartDate,
        setEndDate: setEndDate,
        getURLParameters: getURLParams,
    };
})();