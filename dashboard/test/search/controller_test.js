describe('search module', function() {
    beforeEach(module('ptAnywhere.dashboard.search'));

    var defaultStartDate = moment('2016-06-15 08:00');
    var defaultEndDate = moment('2016-06-15 20:40');

    var ctrl, mockBackend;
    beforeEach(inject(function($controller, $httpBackend) {
        // Prepare local storage
        localStorage.setItem('startISO', defaultStartDate.toISOString());
        localStorage.setItem('endISO', defaultEndDate.toISOString());
        ctrl = $controller('SearchController');
        mockBackend = $httpBackend;
        // Ignore params
        mockBackend.expectGET(/\/a\/data\/sessions?.*/g).respond(['id1', 'id2', 'id3']);
    }));

    it('URL data parameters correspond with controller variables', function() {
        ctrl.actionsNum = 1;
        ctrl.containsCommand = 'aa';
        expect(ctrl.getUrlParams()).toBe('?start=2016-06-15T07:00:00.000Z&end=2016-06-15T19:40:00.000Z&minStatements=1&containsCommand=aa');

        ctrl.startTime = moment('2013-02-08 09:30');
        ctrl.endTime = moment('2013-02-08 10:30');
        ctrl.actionsNum = 2;
        ctrl.containsCommand = '';
        expect(ctrl.getUrlParams()).toBe('?start=2013-02-08T09:30:00.000Z&end=2013-02-08T10:30:00.000Z&minStatements=2&containsCommand=');
    });

    it('endDate automatically changes not to be lower than startDate', function() {
        ctrl.startTime = moment(defaultEndDate).add(1, 'day');
        ctrl.startTimeUpdate();
        expect(ctrl.endTime.isSame(moment(ctrl.startTime).add(1, 'hour'))).toBeTruthy();
    });

    it('updates sessions calling to the backend', function() {
        ctrl.list();
        mockBackend.flush();
        expect(ctrl.sessions).toEqual(['id1', 'id2', 'id3']);
    });
});