// Tic Tac Toe
// Modules (built in plan order):
//   Gameboard         – IIFE, owns the board array        (T2)
//   createPlayer      – factory, one player               (T3)
//   GameController    – IIFE, game flow, wins/ties, score (T4–T5)
//   DisplayController – IIFE, the only module using DOM   (T7+)

// Gameboard: owns the 9 cells. Knows nothing about players or turns.
// Index layout:
//   0 | 1 | 2
//   3 | 4 | 5
//   6 | 7 | 8
const Gameboard = (function () {
  const SIZE = 9;
  let board = new Array(SIZE).fill("");

  // Return a copy so outside code can't change the real board.
  function getBoard() {
    return [...board];
  }

  // Place a mark. Returns true on success, false if the index is
  // out of range or the cell is already taken.
  function placeMark(index, mark) {
    const isValidIndex = Number.isInteger(index) && index >= 0 && index < SIZE;
    if (!isValidIndex) return false;
    if (board[index] !== "") return false;

    board[index] = mark;
    return true;
  }

  function isFull() {
    return board.every((cell) => cell !== "");
  }

  function reset() {
    board = new Array(SIZE).fill("");
  }

  // Log a readable 3x3 grid, with "." for empty cells.
  function print() {
    const show = (cell) => (cell === "" ? "." : cell);
    const rows = [];
    for (let i = 0; i < SIZE; i += 3) {
      rows.push(`${show(board[i])} | ${show(board[i + 1])} | ${show(board[i + 2])}`);
    }
    console.log(rows.join("\n"));
  }

  return { getBoard, placeMark, isFull, reset, print };
})();

// createPlayer: factory for one player (name, mark, score).
// The mark never changes; the name can be updated from the name form.
function createPlayer(name, mark) {
  let playerName = name;
  let score = 0;

  function getName() {
    return playerName;
  }

  function setName(newName) {
    playerName = newName;
  }

  function getMark() {
    return mark;
  }

  function getScore() {
    return score;
  }

  function addWin() {
    score++;
  }

  function resetScore() {
    score = 0;
  }

  return { getName, setName, getMark, getScore, addWin, resetScore };
}

// GameController: runs the game flow (turns, wins, ties, scores).
// Never touches the DOM.
const GameController = (function () {
  // Every row, column and diagonal that wins the game.
  const WIN_LINES = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6],            // diagonals
  ];

  const players = [createPlayer("Player X", "X"), createPlayer("Player O", "O")];
  let activePlayer = players[0]; // X always goes first
  let ties = 0;
  let isOver = false; // true after a win or tie, until newRound/restart

  function switchPlayer() {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  }

  // True if the given mark fills any winning line.
  function checkWinner(mark) {
    const board = Gameboard.getBoard();
    return WIN_LINES.some(([a, b, c]) =>
      board[a] === mark && board[b] === mark && board[c] === mark
    );
  }

  // Try to place the active player's mark at index.
  // Returns { status, winner }:
  //   'invalid'  – cell taken, out of range, or game over; nothing changes
  //   'continue' – mark placed, turn passes to the other player
  //   'win'      – active player won; their score goes up, game is locked
  //   'tie'      – board full with no winner; ties go up, game is locked
  function playRound(index) {
    if (isOver) {
      return { status: "invalid", winner: null };
    }

    const placed = Gameboard.placeMark(index, activePlayer.getMark());
    if (!placed) {
      return { status: "invalid", winner: null };
    }

    if (checkWinner(activePlayer.getMark())) {
      activePlayer.addWin();
      isOver = true;
      return { status: "win", winner: activePlayer };
    }

    if (Gameboard.isFull()) {
      ties++;
      isOver = true;
      return { status: "tie", winner: null };
    }

    switchPlayer();
    return { status: "continue", winner: null };
  }

  // Clear the board for another round. Scores are kept.
  function newRound() {
    Gameboard.reset();
    activePlayer = players[0];
    isOver = false;
  }

  // Start over: new round plus all scores back to zero.
  function restart() {
    newRound();
    players.forEach((player) => player.resetScore());
    ties = 0;
  }

  function getActivePlayer() {
    return activePlayer;
  }

  function getPlayers() {
    return [...players];
  }

  function getScores() {
    return { x: players[0].getScore(), ties, o: players[1].getScore() };
  }

  function isGameOver() {
    return isOver;
  }

  return {
    playRound,
    newRound,
    restart,
    getActivePlayer,
    getPlayers,
    getScores,
    isGameOver,
  };
})();

// DisplayController: the only module that touches the DOM.
// Reads state from Gameboard/GameController and draws it on the page.
const DisplayController = (function () {
  // Cache DOM elements once.
  const boardEl = document.querySelector("#board");

  // Build 9 cell buttons from the current board.
  function renderBoard() {
    boardEl.textContent = ""; // clear old cells

    Gameboard.getBoard().forEach((mark, index) => {
      const cell = document.createElement("button");
      cell.type = "button";
      cell.className = "cell";
      cell.dataset.index = index;
      cell.textContent = mark;
      boardEl.appendChild(cell);
    });
  }

  renderBoard(); // draw the empty board on page load

  return { renderBoard };
})();

console.log("Tic Tac Toe loaded");
