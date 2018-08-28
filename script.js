const Gameboard = (() => {
  let board = ['o','x','o','x','x','o','x','x',''];
  const getBoard = () => board;
  const putPiece = (piece, index) => {
    board[index] = piece;
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

const Game = (() => {
  let winCounter = 0;
  const winningConditions = [
    [0,1,2], [3,4,5], [6,7,8], 
    [0,3,6], [1,4,7], [2,5,8], 
    [0,4,8], [2,4,6]
  ]
  const gameOver = (piece) => {
    winCounter = 0;
    for (let i = 0; i < winningConditions.length; i++) {
      for (let j = 0; j < winningConditions[i].length; j++) {        
        if (Gameboard.getBoard()[winningConditions[i][j]] == piece) {          
          winCounter += 1;
        }
        if (winCounter == 3) {
          console.log(winningConditions[i]);
          return true;
        }
      }
      winCounter = 0;
    }
    return false;
  }
  const turn = () => {

  }
  const reset = () => {
    Gameboard.clearBoard();
  }
  const start = () => {

  }
  return {gameOver, turn, reset, start}
})();

const DisplayController = (() => {
  const render = () => {
    Gameboard.getBoard().forEach(function(piece, index) {
      document.getElementById(`slot${index}`).innerHTML = piece;
    })
  }
  return {render}
})();