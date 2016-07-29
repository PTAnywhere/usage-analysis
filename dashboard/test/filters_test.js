describe('simpleUuid filter', function() {
    beforeEach(module('ptAnywhere.dashboard'));

    var filter;
    beforeEach(inject(function(simpleUuidFilter) {
        filter = simpleUuidFilter;
    }));

    it('shows the expected abreviated UUID', function() {
        // Same uuids tested in the Java API.
        expect(filter('6fc7797b-1a33-4fd7-8db1-1d6e7468db65')).toBe('b8d5exozT9eNsR1udGjbZQ--');
        expect(filter('a9101f6b-ef7c-4372-91c2-9391e94ee233')).toBe('qRAfa.98Q3KRwpOR6U7iMw--');
    });
});