# Tic Tac Toe

A two-player Tic Tac Toe game for the browser, built with plain HTML, CSS and JavaScript. There are no libraries and no build step.

## How to run

Open `index.html` in a browser, or serve the folder with the VS Code Live Server extension.

## How to play

1. Enter a name for each player and press **Start**. If you leave a name empty, it shows as "Player X" or "Player O".
2. Players take turns clicking an empty square. X always goes first.
3. Three marks in a row, column or diagonal wins. If the board fills up with no winner, it's a tie.
4. The scoreboard keeps count of X wins, ties and O wins.
5. **Next Round** clears the board and keeps the score. **Restart** clears the score and goes back to the name form.

## How the code is organised

Everything is in `script.js`, split into four small modules to keep global code to a minimum:

| Module | Pattern | Job |
|---|---|---|
| `Gameboard` | IIFE (module pattern) | Holds the 9 cells and places marks |
| `createPlayer` | Factory | One player: name, mark and score |
| `GameController` | IIFE | Turns, win and tie checks, scores |
| `DisplayController` | IIFE | The only module that touches the DOM: draws the page and handles clicks |

The game logic doesn't touch the DOM, so you can also play from the DevTools console:

```js
GameController.playRound(4); // place the current player's mark in the centre
Gameboard.print();           // show the board as text
```

The cells are numbered 0–8, left to right and top to bottom.
