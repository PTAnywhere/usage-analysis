describe('DiagramHelperService factory', function() {
    beforeEach(module('ptAnywhere.dashboard.stateDiagram'));

    var factory;
    beforeEach(inject(function(DiagramHelperService) {
        factory = DiagramHelperService;
    }));

    function getStdVal(hexValInt) {
        return (hexValInt / 15.0) - 0.0000001;
    }

    it('generates random colors in hexadecimal notation', function() {
        spyOn(Math, 'random').and
                            .returnValues(0, getStdVal(1), getStdVal(9), getStdVal(10), getStdVal(12), getStdVal(15));
        var colorHex = factory._getRandomColor();
        expect(colorHex).toBe('#019acf');
    });

    function expectContain(set, expectedIds) {
        var i;
        for (i in expectedIds) {
            expect(set[i].id).toBe(expectedIds[i]);
        }
    }

    it('creates empty states', function() {
        var states = factory._createStates({states: ['a', 'b', 'c'], levels: []});
        expect(states.length).toBe(3);  // Init and 2 possible results are always added
        expectContain(states, ['init', 'pass', 'fail'])
    });

    it('creates all states for one level', function() {
        var states = factory._createStates({states: ['a', 'b', 'c'], levels: ['level1']});
        expect(states.length).toBe(3 + 3);
        expectContain(states, ['init', 'pass', 'fail', '0:0', '0:1', '0:2']);
    });

    it('creates all states for multiple levels', function() {
        var states = factory._createStates({states: ['a', 'b', 'c'], levels: ['level1', 'level2', 'level3']});
        expect(states.length).toBe(3 * 3 + 3);
        expectContain(states, ['init', 'pass', 'fail',
                               '0:0', '0:1', '0:2',
                               '1:0', '1:1', '1:2',
                               '2:0', '2:1', '2:2']);
    });

    it('draws as many levels as specified', function() {
        var newEdges = [[{id: 0}, {id: 2}], [{id: 5}, {id: 8}], [{id: 3}]];
        var edges = factory._createEdges(newEdges);
        expect(edges.length).toBe(5);
    });

    it('draws as many levels as possible', function() {
        var newEdges = [[{id: 0}, {id: 2}, {id: 5}], [{id: 8}, {id: 3}]];
        var edges = factory._createEdges(newEdges);
        expect(edges.length).toBe(5);  // We have only passed 5 levels
    });
});