# Tic Tac Toe — Plan

## Goal & scope

A browser Tic Tac Toe game for **two human players**, built in vanilla HTML/CSS/JS.

- Players enter their names, then press **Start**.
- Players click a square to place their mark (X goes first).
- The game detects every winning 3-in-a-row and ties.
- A result display shows the winner or a tie when a round ends.
- A **running scoreboard** (X wins / ties / O wins) carries across rounds, as in the mockup.
- **Next Round** clears the board and keeps the score. **Restart** resets the names and the score.
- Development is console-first: the game logic works and is tested in the console before any DOM work.

Out of scope: a computer opponent and the 1P/2P toggle shown in the mockup.

## Architecture

The aim is as little global code as possible. Every module is a factory; a module that only needs one instance is a factory wrapped in an IIFE (the module pattern).

| Module | Kind | Responsibility |
|---|---|---|
| `Gameboard` | IIFE | Owns the board array. Knows nothing about players or turns. |
| `createPlayer` | Factory | One player: name, mark, score. |
| `GameController` | IIFE | Game flow: turns, win/tie checks, round state, scores. No DOM. |
| `DisplayController` | IIFE | The only module that touches the DOM. Renders state and forwards user input to `GameController`. |

### `Gameboard` (IIFE)
- Private `board`: an array of 9 cells, each `""`, `"X"` or `"O"`. Index layout:
  ```
  0 | 1 | 2
  3 | 4 | 5
  6 | 7 | 8
  ```
- `getBoard()`: returns a **copy** of the board.
- `placeMark(index, mark)`: returns `true` on success, or `false` if the index is out of range or the cell is taken.
- `isFull()`: returns `true` when no empty cells remain.
- `reset()`: empties every cell.
- `print()`: logs a readable 3×3 grid to the console.

### `createPlayer(name, mark)` (factory)
- `getName()`, `setName(newName)`, `getMark()`
- `getScore()`, `addWin()`, `resetScore()`

### `GameController` (IIFE)
- Private state: `players` (X and O), `activePlayer`, `ties`, `isOver`.
- Private constant `WIN_LINES`: the 8 winning index triples (3 rows, 3 columns, 2 diagonals).
- Private: `checkWinner()` and `switchPlayer()`.
- `playRound(index)` returns `{ status, winner }`, where `status` is one of:
  - `'invalid'`: the cell is taken, out of range, or the game is already over (state unchanged)
  - `'continue'`: the mark was placed and the turn switched
  - `'win'`: the active player won; their score goes up and the game is locked
  - `'tie'`: the board is full with no winner; ties go up and the game is locked
- `getActivePlayer()`, `getPlayers()`, `getScores()` → `{ x, ties, o }`, `isGameOver()`
- `setPlayerNames(nameX, nameO)`: falls back to "Player X" / "Player O" when a name is empty.
- `newRound()`: resets the board, sets X as the active player and unlocks the game. Scores are kept.
- `restart()`: everything `newRound()` does, plus resetting all scores and ties.

### `DisplayController` (IIFE)
- Caches its DOM elements once.
- `renderBoard()`: builds 9 cell buttons from `Gameboard.getBoard()`, each with `data-index`.
- `renderStatus(result)`: shows whose turn it is, or the result once the round ends.
- `renderScoreboard()`: `NAME (X) | TIE | NAME (O)`, each with its count.
- Uses one click listener on the board container (event delegation) that calls `GameController.playRound(index)` and then re-renders.
- Also wires up the name form, the **Start/Restart** button and the **Next Round** button.

## Game rules / decisions
- X always moves first, including in each new round.
- Clicking a taken cell does nothing. After a win or tie, the board is locked until Next Round or Restart.
- Next Round keeps scores. Restart clears scores and shows the name form again.

## File layout
```
index.html   – markup: name form, board container, status line, scoreboard, buttons
style.css    – styling per mockup
script.js    – Gameboard, createPlayer, GameController, DisplayController (loaded with defer)
```

## UI notes (from `tictactoe UI.png`)
- Black background with white text.
- A 3×3 grid drawn with **inner lines only** (no outer border), done with cell borders.
- Font: Raleway (Google Fonts), with uppercase labels.
- Below the board is a scoreboard row, `NAME (X)   TIE   NAME (O)`, with large count digits under each label.
- Marks are white, large and centered. Empty cells show a subtle hover effect while a round is in progress.

## Phases & tasks

These tasks mirror the todo4vcode tasks in `.todo4vcode/shared-tasks.json`, and the IDs match.

| # | Phase | Task | Priority | Status | Done when |
|---|---|---|---|---|---|
| T1 | 0 Setup | Scaffold `index.html`, `style.css`, `script.js` | Must | ☑ | The page loads, CSS applies, and the script runs (console log) with no errors |
| T2 | 1 Console | `Gameboard` IIFE | Must | ☑ | `placeMark` rejects taken/out-of-range cells; `isFull`, `reset` and `print` work |
| T3 | 1 Console | `createPlayer` factory | Must | ☑ | Two players can be created with names, marks and working score methods |
| T4 | 1 Console | `GameController`: turns + `playRound` | Must | ☑ | Turns alternate X/O and `playRound` returns `continue` / `invalid` correctly |
| T5 | 1 Console | Win + tie detection, game-over lock | Must | ☑ | All 8 lines detected, tie detected, moves after game over return `invalid` |
| T6 | 1 Console | Console playtest | Must | ☑ | Row, column, diagonal, tie, taken-cell and after-game-over scenarios all pass in the console |
| T7 | 2 DOM | `DisplayController`: render board | Must | ☑ | A prefilled X/O board renders correctly in the page |
| T8 | 2 DOM | Click to place marks | Must | ☐ | Clicking empty cells places marks; taken cells and a finished game ignore clicks |
| T9 | 2 DOM | Status + result display | Must | ☐ | Shows whose turn it is, then the winner's name or "Tie" at the end |
| T10 | 3 UI | Names, Start/Restart, Next Round | Must | ☐ | Names flow into the game; Restart resets everything; Next Round keeps scores |
| T11 | 3 UI | Running scoreboard | Must | ☐ | X wins / ties / O wins update after each round and reset on Restart |
| T12 | 4 Polish | Match the mockup + README | Should | ☐ | Styled like the mockup, works on mobile width, README describes the project |

## Progress log

<!-- One line per finished task: YYYY-MM-DD · T# · short note -->
- 2026-11-05 · T1 · Scaffolded index.html (section placeholders), style.css (base + Raleway), script.js (defer). Verified in headless Chrome: script logs, no errors, black background.
- 2026-11-05 · T2 · Gameboard IIFE: getBoard (copy), placeMark (rejects taken, out-of-range and non-integer indexes), isFull, reset, print. Verified with 10 scripted checks in Node, all passing.
- 2026-11-05 · T3 · createPlayer factory: getName/setName, getMark, getScore/addWin/resetScore with private name and score. Verified with 7 scripted checks in Node (two independent players), all passing.
- 2026-11-05 · T4 · GameController IIFE: X/O players, activePlayer + private switchPlayer, playRound returns continue/invalid (invalid keeps the turn). getActivePlayer, getPlayers. Verified with 9 scripted checks in Node, all passing.
- 2026-11-05 · T5 · WIN_LINES + checkWinner, tie on full board, isOver lock, newRound (keeps scores), restart (clears scores), getScores, isGameOver. Win is checked before tie, so a 9th-move win counts as a win. Verified with 21 scripted checks in Node (all 8 lines for X, O column win, tie, locked moves, newRound/restart), all passing.
- 2026-11-05 · T6 · Console playtest in headless Chrome against the real script.js: X row win, O column win, diagonal win, tie, taken cell rejected (turn kept), move after game over rejected (board unchanged); running score X 3 / ties 1 / O 1 across rounds. 11/11 checks pass, no code changes. Phase 1 complete.
- 2026-11-05 · T7 · DisplayController IIFE: caches #board, renderBoard builds 9 button.cell elements with data-index, renders on load. Basic 3x3 grid CSS. Verified in headless Chrome with temporary prefilled X/O data (screenshot + DOM dump correct), test data removed, page loads with 9 empty cells.
