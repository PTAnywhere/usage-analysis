/**
 * The Revealing Module Pattern.
 */
var chart = (function () {

  var network;

  var nodes = new vis.DataSet();
  var edges = new vis.DataSet();

  var numberOfLevels;


  function init(statesPerSession) {
    numberOfLevels = statesPerSession;

    var container = document.getElementById('networkMap');
    var data = {
      nodes: nodes,
      edges: edges
    };
    var options = {
      nodes: {
        shape: 'dot',
        font: {
          face: 'Tahoma'
        }
      },
      edges: {
        width: 0.15,
        smooth: {
          type: 'continuous'
        }
      },
      interaction: {
        dragNodes: false
      },
      physics:{
        enabled: false
      }
    };

    network = new vis.Network(container, data, options);
    drawStates();
  }

  function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  function assert(condition, message) {
    if (!condition) {
        throw message || "Assertion failed";
    }
  }

  function drawStates() {
    var states = ['ADD', 'DEL', 'UPD', 'CONN', 'DISCONN', 'NOOP'];
    for (var i=1; i<=numberOfLevels; i++) {
      var color = getRandomColor();
      for (var j=0; j<states.length; j++) {
        nodes.add(
          {id: states[j] + String(i), label: states[j], color: color, x: 100*j, y: 100*i, size: 10}
        );
      }
    }
    nodes.add(
      {id: 'init', label: 'init', color: getRandomColor(), x: 100*(states.length-1)/2.0, y: 0, size: 10}
    );
    var color = getRandomColor();
    nodes.add([
      {id: 'pass', label: 'pass', color: color, x: 100*(states.length-1)/3.0, y: 100*(numberOfLevels+1), size: 10},
      {id: 'fail', label: 'fail', color: color, x: 200*(states.length-1)/3.0, y: 100*(numberOfLevels+1), size: 10},
    ]);
    network.fit(); // zoom to fit
  }

  function loadJSON(path, success, error) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          success(JSON.parse(xhr.responseText));
        }
        else {
          error(xhr);
        }
      }
    };
    xhr.open('GET', path, true);
    xhr.send();
  }

  function drawEdges(actionsPerSessions) {
    var ret = [];
    for (var i=0; i<actionsPerSessions.length; i++) {
        // Levels + final state
        assert(actionsPerSessions[i].length==numberOfLevels+1, "The session has more states than expected.");
        var previousState = "init";
        for (var j=0; j<numberOfLevels+1; j++) {
          var currentState = actionsPerSessions[i][j]; // Levels + final state
          ret.push({"from": previousState, "to": currentState});
          previousState = currentState;
        }
    }
    edges.clear();
    edges.add(ret);
    network.fit(); // zoom to fit
  }

  function loadEdges(jsonPath) {
    loadJSON(jsonPath, drawEdges, function(err) {console.log('Problem loading edges.')});
  }

  return {
      create: init,
      load: loadEdges
  };

})();
