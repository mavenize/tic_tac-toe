# CLAUDE.md

## Project
A two-player Tic Tac Toe game in vanilla HTML/CSS/JS, with no build step. To run it, open `index.html` in a browser (or use the VS Code Live Server extension). The UI reference is `tictactoe UI.png`.

## Code rules
- Keep global code to a minimum. Use **factories**, and wrap a factory in an **IIFE** (module pattern) when only one instance is needed (`Gameboard`, `GameController`, `DisplayController`).
- Game logic (`Gameboard`, `createPlayer`, `GameController`) never touches the DOM. Only `DisplayController` does.
- Build in this order: console game first, then DOM, then UI polish, following the phases in `plan.md`.
- Keep it beginner-friendly: plain readable JS with no libraries and no clever tricks.

## Workflow: plan.md + todo4vcode

**`plan.md`** is the source of truth for the architecture, the decisions and the task order (T1–T12).
**`.todo4vcode/shared-tasks.json`** is the live tracker, shown in the todo4vcode sidebar in VS Code. Its task IDs match the plan (`T1 · ...`).

For each task:
1. **Start**: set the task's `status` to `"In Progress"` in todo4vcode.
2. **Work**: tick each subtask (`completed: true`) as it gets done.
3. **Finish**:
   - Set the task's `status` to `"Done"` and `completed: true`.
   - Add code-reference tags for the code written, e.g. `"script.js:12-48"`, so clicking the task jumps to its code.
   - In `plan.md`, change the task's ☐ to ☑ and add a progress-log line: `YYYY-MM-DD · T# · note`.
4. **Propose a commit message** (see below), then stop and wait for the user.

Other rules:
- Do one task at a time, in plan order, unless the user says otherwise.
- New work or a design change goes into **both** `plan.md` and todo4vcode before starting on it.
- When editing `shared-tasks.json` by hand, keep it valid JSON. Use the status values `Todo` / `In Progress` / `Done` and the priority values `Must` / `Should` / `Could` / `Wont`.

## Commits
- After each task is done, **propose a commit message** so the user can commit to GitHub themselves. Use conventional style, e.g. `feat(gameboard): add board array and placeMark guard`.
- Do not run `git commit` or `git push` unless asked.
- **Never add a `Co-Authored-By: Claude` line** (or any other AI attribution) to commit messages.

## Testing
- **Phase 1 (console)**: call the modules from the browser DevTools console (e.g. `GameController.playRound(0)`, `Gameboard.print()`) and run the scenarios listed in T6.
- **Phases 2–4 (DOM/UI)**: check in the browser. Click through a win, a tie and a click on a taken cell, then Next Round and Restart.
- Before marking a task Done, say how it was verified.
