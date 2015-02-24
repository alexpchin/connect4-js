var $      = require('jquery');
var socket = require('socket.io-client')('http://localhost');

$(function(){
  // var socket = io();
  socket.on('connection', function() {
    console.log('Connected!');
  });
  
  socket.on('moves', function(move) {
    console.log(move);
  });

  var $board = $('#board');
  var num_col = 7;
  var num_row = 6;
  var num_squares = num_col*num_row;
  var color = "red";
  var winner;
  var array;

  function setupBoard(){
    var c = 0;
    array = [];
    for (c; c < num_col; c++) {
      $board.append('<div class="column" name="'+c+'"></div>');
      array.push([]);
    }
    var columns = $board.children(".column");

    for (i = num_col-1; i >= 0; i--) {
      for (r = num_row-1; r >= 0; r--) { 
        $(columns[i]).append('<input class="square" name="'+i+'" value="'+r+'">');
      }
    }
  }

  // NB. Object.keys doesn't work in IE<9
  function transpose(array) {
    return Object.keys(array[0]).map(function(c) {
      return array.map(function(r) {
        return r[c];
      });
    });
  }

  function compareArrays(array1, array2) {
    return JSON.stringify(array1) == JSON.stringify(array2);
  }

  function checkWinner() {
    return typeof winner == "undefined"
  }

  function fourInARow(array) {
    $(array).each(function(index, column){
      if (column.length > 3) {
        $(column).each(function(i,e) {
          slice = column.slice(i, i+4);
          if (compareArrays(slice, ["red", "red", "red", "red"])) {
            console.log("Red wins...");
            return winner = "red";
          } else if (compareArrays(slice, ["yellow", "yellow", "yellow", "yellow"])) {
            console.log("Yellow wins...");
            return winner = "yellow";
          }
        });
      }
    });
  }

  function verticalWin(array) {
    fourInARow(array)  
  }

  function horizontalWin(array) {
    fourInARow(transpose(array));
  }

  function forwardDiagonal(array) {
    // var transposed = math.transpose(array);
    // var squeezed   = math.squeeze(transposed);
    // var diagonals  = math.diag(squeezed);
    // return diagonals;
  }

  function backwardDiagonal(arr) {
    return forwardDiagonal(arr.reverse());
  }

  function diagonalWin(array) {
    fourInARow(forwardDiagonal(array));
    fourInARow(backwardDiagonal(array));
  }

  function checkForWin(array) {
    verticalWin(array);
    horizontalWin(array);
    diagonalWin(array);
    return checkWinner();
  }

  function storeMove(col) {
    var index = parseInt(col);
    var slice;
    console.log(index, color);
    array[index].push(color);

    checkForWin(array);

    if (typeof winner !== 'undefined') {
      alert(winner + " WINS");
    } else {
      console.log("no winner");
    }
  }

  function changePlayer(){
    if (color == "red") {
      color = "yellow";
    } else {
      color = "red";
    }
  }

  function addPiece(column){
    var $squares = $(column).children();
    var unplayed = [];
    $squares.each(function(index, element) {
      if (!($(element).hasClass("red") || $(element).hasClass("yellow"))) {
        unplayed.push(element);
      }
    });

    $($(unplayed).last()).addClass(color);
    storeMove($(unplayed).attr("name"), color);
    
    changePlayer();
  }

  setupBoard();
  
  $board.on("click", ".column", function(){
    var $column = $(this);
    addPiece($column);
  });

});