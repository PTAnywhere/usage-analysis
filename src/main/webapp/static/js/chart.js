/**
 * The Revealing Module Pattern.
 */
var chart = (function () {

  var data;  // Cached events per session.

  var network;

  var nodes = new vis.DataSet();
  var edges = new vis.DataSet();

  function init() {
    var container = document.getElementById('networkMap');
    var netData = {
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
        },
        arrows: {
            to: true,
        },
      },
      interaction: {
        dragNodes: false
      },
      physics:{
        enabled: false
      }
    };

    network = new vis.Network(container, netData, options);
  }

  function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  function getMaxLevel() {
    var max = 0;
    for (var i=0; i<data.length; i++) {
      if (data[i].length>max) {
        max = data[i].length;
      }
    }
    return max;
  }

  function drawSlider() {
    var maxLevels = getMaxLevel();
    slider.init(maxLevels, updateMap);
    updateMap(slider.value());
  }

  function updateMap(numberOfLevels) {
      $(".number-levels").text(numberOfLevels);
      drawStates(numberOfLevels);
      drawEdges(numberOfLevels);
  }

  function drawStates(numberOfLevels) {
    var states = ['ADD', 'DEL', 'UPD', 'CONN', 'DISCONN', 'NOOP'];
    nodes.clear();
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
    $.ajax({
        dataType: "json",
        url: path,
        success: success,
        timeout: 2000,
        error: error
    });
  }

  function drawEdges(numberOfLevels) {
    var ret = [];
    for (var i=0; i<data.length; i++) {
        var action = 1;
        var currentState, previousState = "init";
        for (var j=0; j<data[i].length; j++) {
          currentState = data[i][j] + String(j+1); // Levels + final state
          ret.push({"from": previousState, "to": currentState});
          previousState = currentState;
          action++;
          if (action>numberOfLevels) break;
        }
        // If no enough events were registered, fill them with NOP.
        for (var r=action; r<=numberOfLevels; r++) {
          currentState = "NOOP" + String(r);
          ret.push({"from": previousState, "to": currentState});
          previousState = currentState;
        }
        // Select random final state
        currentState = (Math.random()>0.5)? "pass": "fail";
        ret.push({"from": previousState, "to": currentState});
    }
    edges.clear();
    edges.add(ret);
    network.fit(); // zoom to fit
  }

  function showLoadingError(xhr, textStatus, errorThrown) {
      if (textStatus == 'timeout') {
          errorDialog.open("The topology could not be loaded: timeout.");
      } else {
          errorDialog.open("The topology could not be loaded: " + errorThrown + ".");
      }
  }

  function loadEdges(jsonPath) {
    loadJSON(jsonPath, function(actionsPerSessions) {
      data = actionsPerSessions;
      drawSlider();
      $("#show-info").show();
    }, showLoadingError);
  }

  return {
      create: init,
      load: loadEdges
  };

})();


var slider = (function () {
    var elId = "#slider-levels";

  function init(maxLevels, callback) {
    var defaultSelection = (maxLevels>=3)? 3: maxLevels;
    $( elId ).slider({
      range: "min",
      value: defaultSelection,
      min: 1,
      max: maxLevels,
      slide: function( event, ui ) {
        callback(ui.value);
      }
    });
  }

  function getSelectedValue() {
    return $( elId ).slider( "value" );
  }

  return {
      init: init,
      value: getSelectedValue,
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