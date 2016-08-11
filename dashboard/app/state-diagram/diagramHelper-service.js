angular.module('ptAnywhere.dashboard.stateDiagram')
    .factory('DiagramHelperService', ['$q', '$timeout', function($q, $timeout) {
        var SCALE = 100;
        var network;
        var nodes = new vis.DataSet();
        var edges = new vis.DataSet();
        var maxLevels = 3;
        var levelsDisplayed = 3;
        var finalStateDisplayed = false;

        function getRandomColor() {
            var letters = '0123456789abcdef'.split('');
            var color = '#';
            for (var i = 0; i < 6; i++ ) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }

        function createStates(data) {
            var newNodes = [{
                    group: 0,
                    id: 'init',
                    label: 'init',
                    x: SCALE * ( data.states.length - 1) / 2.0,
                    y: 0
                }];

            var levelsToAdd = data.levels.length;
            if (finalStateDisplayed) {
                var finalLevel = levelsToAdd;
                levelsToAdd = finalLevel - 1;
                newNodes.push({
                    group: finalLevel,
                    id: 'pass',
                    label: 'pass',
                    x: SCALE * (data.states.length - 1) / 3.0,
                    y: SCALE * finalLevel
                });
                newNodes.push({
                    group: finalLevel,
                    id: 'fail',
                    label: 'fail',
                    x: (2 * SCALE) * (data.states.length - 1) / 3.0,
                    y: SCALE * finalLevel
                });
            }

            // Create intermediate levels
            for (var i = 0; i < levelsToAdd; i++) {
                for (var j = 0; j < data.states.length; j++) {
                    newNodes.push({
                        group: i+1,
                        id: String(i) + ":" + String(j),
                        label: data.states[j],
                        x: SCALE * j,
                        y: SCALE * (i + 1)
                    });
                }
            }
            return newNodes;
        }

        // Avoid blocking browser in consuming operations.
        function addEdgeAsync(edge) {
            return $timeout(function() {
                edges.add(edge);
            });
        }

        function createEdges(levels) {
            var newEdges = [];
            for (var i = 0; i < levels.length; i++) {
                for (var j = 0; j < levels[i].length; j++) {
                    levels[i][j].group = i;
                    newEdges.push(levels[i][j]);
                }
            }
            return newEdges;
        }

        function getGroups(steps) {
            var ret = {};
            for (var i=0; i<steps+2; i++) {  // 2 extra levels/steps: init and final state
                var color = getRandomColor();
                ret[String(i)] = {
                    color: {
                        border: color,
                        background: color,
                        highlight: {
                            border: color,
                            background: '#ffffff'
                        }
                    }
                };
            }
            return ret;
        }

        function getOptions() {
            var nodeSize = SCALE / 10;
            return {
               nodes: {
                   shape: 'dot',
                   size: nodeSize,
                   font: {face: 'Tahoma'}
               },
               edges: {
                   width: 0.1,
                   hoverWidth: 0.2,
                   smooth: {type: 'continuous'},
                   arrows: {to: {scaleFactor: 0.2}}
               },
               interaction: {dragNodes: false},
               physics: {enabled: false},
               groups: getGroups(maxLevels)
           };
        }

        function filter(item) {
            // levelsDisplayed + 1 => to consider also init state/level
            return item.group < levelsDisplayed + 1 ||
                    (levelsDisplayed + 1 === maxLevels && finalStateDisplayed);  // Show final state
        }

        function updateDisplayedData() {
            network.setData({
                nodes: nodes.get({filter: filter}),
                edges: edges.get({filter: filter})
            });
            network.fit(); // zoom to fit
        }

        return {
            init: function(container, fsd) {
                if (typeof finalStateDisplayed !== 'undefined') finalStateDisplayed = fsd;  // Might be undefined.
                maxLevels = 0;
                levelsDisplayed = maxLevels;
                var netData = {nodes: [], edges: []};
                network = new vis.Network(container, netData, getOptions());
            },
            _getRandomColor: getRandomColor,
            _createStates: createStates,
            _createEdges: createEdges,
            update: function(data) {
                nodes.clear();
                edges.clear();
                maxLevels = data.levels.length;
                network.setOptions(getOptions());

                // Avoid blocking browser in consuming operations.
                return $timeout(function() {
                    // apparently DataSet.add is much more computation consuming than Array.push,
                    // so creating a temporary array makes sense.
                    nodes.add(createStates(data));
                }).then(function() {
                    return $timeout(function() {
                        edges.add(createEdges(data.levels));
                    }).then(function() {
                        updateDisplayedData();
                    });
                });
            },
            display: function(levelsToShow) {
                levelsDisplayed = levelsToShow;
                updateDisplayedData();
            }
        };
    }]);