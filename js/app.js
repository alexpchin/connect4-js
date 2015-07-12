(function(){
  var num_col = 7,
      num_row = 6,
      num_squares = num_col*num_row,
      color = "red",
      array,
      $message,
      $board,
      $cells,
      over,
      directions = {
        n:  [0,1],
        ne: [1,1],
        e:  [1,0],
        se: [1,-1],
        s:  [0,-1],
        sw: [-1,-1],
        w:  [-1,0],
        nw: [-1,1]
      },

  reset = function(){
    $cells.removeClass('red yellow');
    $message.empty();
    over = false;
  },

  initialize = function() {
    array = createBoard();
    $('body').append("<h1 class='animated fadeInDown'>Connect4</h1>");
    $board = $("<div id='board' class='animated fadeInUpBig'></div>").appendTo('body').each(function(){
      $board = $('#board');
      $message = $('body').append('<h2></h2>');
      createColumns(function(){
        createSquares(bindEvents)
      });
    });    
  },

  createBoard = function(){
    var c = 0,
        r = 0,
        array = [];

    for(c; c<num_col; c++) {
      array.push([]);
      for(r; r<num_row; r++) {
        array[c].push(null)
      }
    }
    return array;
  },

  createColumns = function(callback) {
    var c = 0;

    for (c; c < num_col; c++) {
      $board.append('<div class="column" name="'+c+'"></div>');
    }
    callback();
  },

  createSquares = function(callback) {
    var columns = $board.children(".column");

    for (i = num_col-1; i >= 0; i--) {
      for (r = num_row-1; r >= 0; r--) { 
        $(columns[i]).append('<div class="square"><input name="'+i+'" value="'+r+'"></div>');
      }
    }
    $cells = $('input');
    callback();
  },

  bindEvents = function() {
    $board.on("click", ".column", function(){
      addPiece($(this));
    });
  },

  addPiece = function(column){
    if (over) {
      reset();
    }

    var $squares = column.children(); 
    var unplayed = $squares.map(function(index, element) {
      if (!($(element).find('input').hasClass("red") || $(element).find('input').hasClass("yellow"))) {
        return element;
      }
    });

    $(unplayed).last().find('input').addClass(color+ " animated bounceIn");
    storeMove($(unplayed).last().find('input'), color);
    changePlayer();
  },

  changePlayer = function(){
    var colorMap = { red: "yellow", yellow: "red" }
    color = colorMap[color]
  },

  storeMove = function(square, color) {
    var row = parseInt(square.attr("value"));
    var col = parseInt(square.attr("name"));
    array[col][row] = color;

    checkForWin(col, row, color);
  },

  compassSearch = function(col, row, value, count) {
    var current = array[col][row],
        next_col = col + value[0],
        next_row = row + value[1];
        
    if (array[next_col] !== undefined){
      next = array[next_col][next_row];

      if (current === next) {
        count++
        if (count === 4) {
          $message.html(color.substring(0,1).toLocaleUpperCase() + color.substring(1) + " WINS");
          over = true;
          return true;
        }
        compassSearch(next_col, next_row, value, count);
      } else {
        return false;
      } 
    } 
  }

  checkForWin = function(col, row, color) {
    var count = 1;
    $.each(directions, function(key, value) {
      compassSearch(col, row, value, count)
    });
  },

  addLoadEvent = function(func) {
    var oldonload = window.onload;
    if (typeof window.onload != 'function') {
      window.onload = func;
    } else {
      window.onload = function() {
        if (oldonload) {
          oldonload();
        }
        func();
      }
    }
  };

  addLoadEvent(initialize);

}());