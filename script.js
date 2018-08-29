const Gameboard = (() => {
  let board = ['','','','','','','','',''];
  const getBoard = () => board;
  const putPiece = (piece, index) => {
    if (board[index] == '') {
      board[index] = piece;
      DisplayController.render();
    } else {
      return false;
    }
  }
  const clearBoard = () => {
    board = ['', '', '', '', '', '', '', '', ''];
  }
  return {getBoard, putPiece, clearBoard}
})();

const Player = (name, side) => {
  const getSide = () => side;
  const getName = () => name;
  const {putPiece} = Gameboard
  return {getName, getSide, putPiece}
}

// Default player names
let player1 = Player('player1', 'X');
let player2 = Player('player2', 'O');

// Controls game logic
const Game = (() => {
  let winCounter = 0;
  let currentPlayer;
  const winningConditions = [
    [0,1,2], [3,4,5], [6,7,8], 
    [0,3,6], [1,4,7], [2,5,8], 
    [0,4,8], [2,4,6]
  ]
  let winningCondition;
  const gameOver = (piece) => {
    winCounter = 0;
    for (let i = 0; i < winningConditions.length; i++) {
      for (let j = 0; j < winningConditions[i].length; j++) {        
        if (Gameboard.getBoard()[winningConditions[i][j]] == piece) {          
          winCounter += 1;
        }
        if (winCounter == 3) {
          console.log('win');
          winningCondition = winningConditions[i];
          DisplayController.hightlightWinningPiece();          
          DisplayController.addCover();
          DisplayController.renderGameOver();
          return true;
        } else if (!(Gameboard.getBoard().includes(''))) {
          console.log('tie');
          DisplayController.addCover();
          DisplayController.renderTie();
          return true;
        }
      }
      winCounter = 0;
    }
    return false;
  }
  const getWinningCondition = () => winningCondition;
  const setCurrentPlayer = () => {
    currentPlayer = player1;
  }
  const getCurrentPlayer = () => currentPlayer;
  const switchTurn = () => {
    if (currentPlayer.getSide() == 'X') {
      currentPlayer = player2;
    } else {
      currentPlayer = player1;
    }
    DisplayController.renderPlayerTurn(); 
  }
  const reset = () => {
    Gameboard.clearBoard();
  }
  const start = () => {
    Game.setCurrentPlayer();
    DisplayController.addEventListenerToSlots();
  }
  return {gameOver, getCurrentPlayer, switchTurn, reset, start, getWinningCondition, setCurrentPlayer}
})();

// Controls Display on HTML
const DisplayController = (() => {
  const slots = document.getElementsByClassName('slot');
  const displayMessage = document.getElementById('display-message');

  const render = () => {
    Gameboard.getBoard().forEach(function(piece, index) {
      document.getElementById(`slot${index}`).childNodes[0].innerHTML = piece;
    })
  }
  const resetColor = () => {
    for ( let i = 0; i < slots.length; i++ ) {
      slots[i].childNodes[0].style.color = "black";
    }
  }
  const hightlightWinningPiece = () => {
    Game.getWinningCondition().forEach(function(index, i) {      
      document.getElementById(`slot${index}`).childNodes[0].style.color = "red";
    })    
  }
  const renderPlayerTurn = () => {
    displayMessage.innerHTML = `${Game.getCurrentPlayer().getName()} (${Game.getCurrentPlayer().getSide()})'s Turn`;
  }
  const renderGameOver = () => {
    document.getElementById('winner').innerHTML = `${Game.getCurrentPlayer().getName()} Wins!`;
  }
  const renderTie = () => {
    document.getElementById('winner').innerHTML = "It's a tie!";
  }
  const addCover = () => {
    document.getElementById('cover').className = 'd-flex fadeIn';
  }
  const removeCover = () => {
    document.getElementById('cover').className = 'hidden';
  }
  const addEventListenerToSlots = () => {    
    for (let i = 0; i < slots.length; i++) {
      slots[i].addEventListener('click', function applyPiece() {      
        Game.getCurrentPlayer().putPiece(Game.getCurrentPlayer().getSide(), i);
        Game.gameOver(Game.getCurrentPlayer().getSide());
        Game.switchTurn();         
        slots[i].removeEventListener('click', applyPiece);
      });
    }
  }
  const removeEventListenerFromSlots = () => {
    let old_element = document.getElementById("display");
    let new_element = old_element.cloneNode(true);
    old_element.parentNode.replaceChild(new_element, old_element);
  }
  return {render, renderPlayerTurn, renderGameOver, renderTie, addEventListenerToSlots , 
          removeEventListenerFromSlots, addCover, removeCover, hightlightWinningPiece, resetColor}
})();

// General 
const goBtn = document.getElementById('go-btn');
goBtn.addEventListener('click', () => {
  const form = document.forms[0];
  let player1name = form.elements['player1-name'].value;
  let player2name = form.elements['player2-name'].value;
  player1 = Player(player1name, 'X');
  player2 = Player(player2name, 'O'); 
  Game.start();  
  DisplayController.renderPlayerTurn();
  document.getElementById('player-info').classList.add('hidden');
  document.getElementById('start').classList.add('hidden');
});

const resetBtn = document.getElementById('reset');
reset.addEventListener('click', () => {
  Game.reset();
  DisplayController.removeEventListenerFromSlots();
  DisplayController.addEventListenerToSlots(); 
  DisplayController.resetColor();
  DisplayController.removeCover();
  DisplayController.render();
  DisplayController.renderPlayerTurn();
});