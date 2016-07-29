describe('StateDiagramHelper factory', function() {
    beforeEach(module('ptAnywhere.dashboard'));

    var factory;
    beforeEach(inject(function(StateDiagramHelper) {
        factory = StateDiagramHelper;
    }));

    function getStdVal(hexValInt) {
        return (hexValInt / 15.0) - 0.0000001;
    }

    it('generates random colors in hexadecimal notation', function() {
        spyOn(Math, 'random').and
                            .returnValues(0, getStdVal(1), getStdVal(9), getStdVal(10), getStdVal(12), getStdVal(15));
        var colorHex = factory._getRandomColor();
        expect(colorHex).toBe('#019ACF');
    });

    function expectContain(set, expectedIds) {
        var i = 0;
        for (i in expectedIds) {
            expect(set.get(expectedIds[i])).not.toBeNull();
        }
    }

    it('creates empty states', function() {
        var states = factory._drawStates([], 0);
        expect(states.length).toBe(3);  // Init and 2 possible results are always added
        expectContain(states, ['init', 'pass', 'fail'])
    });

    it('creates all states for one level', function() {
        var states = factory._drawStates(['a', 'b', 'c'], 1);
        expect(states.length).toBe(3 + 3);
        expectContain(states, ['init', 'pass', 'fail', '0:0', '0:1', '0:2']);
    });

    it('creates all states for multiple levels', function() {
        var states = factory._drawStates(['a', 'b', 'c'], 3);
        expect(states.length).toBe(3 * 3 + 3);
        expectContain(states, ['init', 'pass', 'fail',
                               '0:0', '0:1', '0:2',
                               '1:0', '1:1', '1:2',
                               '2:0', '2:1', '2:2']);
    });

    it('draws as many levels as specified', function() {
        var edges = [{id: 0}, {id: 2}, {id: 5}, {id: 8}, {id: 3}];
        var edges = factory._drawEdges(edges, 3);
        expect(edges.length).toBe(3);
    });

    it('draws as many levels as possible', function() {
        var edges = [{id: 0}, {id: 2}, {id: 5}, {id: 8}, {id: 3}];
        var edges = factory._drawEdges(edges, 10);
        expect(edges.length).toBe(5);  // We have only passed 5 levels
    });
});