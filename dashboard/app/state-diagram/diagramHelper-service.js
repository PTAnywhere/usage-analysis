angular.module('ptAnywhere.dashboard.stateDiagram')
    .factory('DiagramHelperService', [function() {
        var network;
        var nodes = new vis.DataSet();
        var edges = new vis.DataSet();
        var finalStateDisplayed = false;

        function getRandomColor() {
            var letters = '0123456789ABCDEF'.split('');
            var color = '#';
            for (var i = 0; i < 6; i++ ) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }

        function drawStates(states, levelsToShow) {
            var color = null;

            nodes.clear();
            for (var i = 0; i  < levelsToShow; i++) {
                color = getRandomColor();
                for (var j = 0; j < states.length; j++) {
                    nodes.add({
                        id: String(i) + ":" + String(j),
                        label: states[j],
                        color: color,
                        size: 10,
                        x: 100 * j,
                        y: 100 * (i + 1)
                    });
                }
            }
            nodes.add({
                id: 'init',
                label: 'init',
                color: getRandomColor(),
                x: 100 * (states.length - 1) / 2.0,
                y: 0,
                size: 10
            });
            color = getRandomColor();
            nodes.add([
                {
                    id: 'pass', label: 'pass', color: color,
                    size: 10,
                    x: 100 * (states.length - 1) / 3.0,
                    y: 100 * (levelsToShow +1 )
                }, {
                    id: 'fail',
                    label: 'fail',
                    color: color,
                    size: 10,
                    x: 200 * (states.length - 1) / 3.0,
                    y: 100 * (levelsToShow+ 1 )
                }
            ]);
            return nodes;
        }

        function drawEdges(levels, levelsToShow) {
            edges.clear();
            for (var i = 0; i < levels.length && i < levelsToShow; i++) {
                edges.add(levels[i]);
            }
            //currentState = (Math.random()>0.5)? "pass": "fail";
            //edges.add({ 'from': previousState, 'to': currentState });
            return edges;
        }

        return {
            init: function(container, fsd) {
                if (typeof finalStateDisplayed !== 'undefined') finalStateDisplayed = fsd;  // Might be undefined.
                var netData = {nodes: nodes, edges: edges};
                var options = {
                    nodes: {
                        shape: 'dot',
                        font: {face: 'Tahoma'}
                    },
                    edges: {
                        width: 0.1,
                        smooth: {type: 'continuous'},
                        arrows: {to: {scaleFactor: 0.2}}
                    },
                    interaction: {dragNodes: false},
                    physics:{enabled: false}
                };

                network = new vis.Network(container, netData, options);
            },
            _getRandomColor: getRandomColor,
            _drawStates: drawStates,
            _drawEdges: drawEdges,
            update: function(data, levelsToShow) {
                drawStates(data.states, levelsToShow);
                // If we have final transitions and we are showing "all" levels (levels-1),
                // draw also the final state transitions.
                var extraLevel = (finalStateDisplayed && levelsToShow + 1 == data.levels.length)? 1: 0;
                drawEdges(data.levels, levelsToShow + extraLevel);
                network.fit(); // zoom to fit
            }
        };
    }]);