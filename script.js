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

// GameController: runs the game flow (turns, moves). Never touches the DOM.
const GameController = (function () {
  const players = [createPlayer("Player X", "X"), createPlayer("Player O", "O")];
  let activePlayer = players[0]; // X always goes first

  function switchPlayer() {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  }

  // Try to place the active player's mark at index.
  // Returns { status, winner }:
  //   'invalid'  – cell taken or out of range; nothing changes
  //   'continue' – mark placed, turn passes to the other player
  function playRound(index) {
    const placed = Gameboard.placeMark(index, activePlayer.getMark());
    if (!placed) {
      return { status: "invalid", winner: null };
    }

    switchPlayer();
    return { status: "continue", winner: null };
  }

  function getActivePlayer() {
    return activePlayer;
  }

  function getPlayers() {
    return [...players];
  }

  return { playRound, getActivePlayer, getPlayers };
})();

console.log("Tic Tac Toe loaded");
