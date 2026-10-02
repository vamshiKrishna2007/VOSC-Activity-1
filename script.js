// The board stores each square as X, O, or an empty string.
const board = ["", "", "", "", "", "", "", "", ""];
const cells = document.querySelectorAll(".cell");
const statusMessage = document.querySelector("#game-status");
const newGameButton = document.querySelector("#new-game");
const scoreElements = {
  X: document.querySelector("#score-x"),
  O: document.querySelector("#score-o"),
  draws: document.querySelector("#score-draws")
};

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

let currentPlayer = "X";
let gameActive = true;
const scores = { X: 0, O: 0, draws: 0 };

// Each square listens for a click and sends its position to the game logic.
cells.forEach((cell) => {
  cell.addEventListener("click", handleCellClick);
});
newGameButton.addEventListener("click", startNewGame);

function handleCellClick(event) {
  const cell = event.currentTarget;
  const cellIndex = Number(cell.dataset.index);

  if (!gameActive || board[cellIndex] !== "") {
    return;
  }

  board[cellIndex] = currentPlayer;
  cell.textContent = currentPlayer;
  cell.classList.add(currentPlayer === "X" ? "mark-x" : "mark-o");
  cell.setAttribute("aria-label", `Cell ${cellIndex + 1}, ${currentPlayer}`);
  cell.disabled = true;

  const winningLine = checkForWinner();
  if (winningLine) {
    finishWithWinner(winningLine);
    return;
  }

  if (checkForDraw()) {
    finishWithDraw();
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusMessage.textContent = `Player ${currentPlayer}'s turn`;
}

function checkForWinner() {
  for (const combination of winningCombinations) {
    const [first, second, third] = combination;
    if (board[first] !== "" && board[first] === board[second] && board[first] === board[third]) {
      return combination;
    }
  }
  return null;
}

function checkForDraw() {
  return board.every((cell) => cell !== "");
}

function finishWithWinner(winningLine) {
  gameActive = false;
  scores[currentPlayer] += 1;
  scoreElements[currentPlayer].textContent = scores[currentPlayer];
  winningLine.forEach((index) => cells[index].classList.add("winning-cell"));
  statusMessage.textContent = `Player ${currentPlayer} wins!`;
  disableRemainingCells();
}

function finishWithDraw() {
  gameActive = false;
  scores.draws += 1;
  scoreElements.draws.textContent = scores.draws;
  statusMessage.textContent = "It's a draw!";
  disableRemainingCells();
}

function disableRemainingCells() {
  cells.forEach((cell) => {
    cell.disabled = true;
  });
}

function startNewGame() {
  board.fill("");
  currentPlayer = "X";
  gameActive = true;
  statusMessage.textContent = "Player X's turn";

  cells.forEach((cell, index) => {
    cell.textContent = "";
    cell.disabled = false;
    cell.classList.remove("mark-x", "mark-o", "winning-cell");
    cell.setAttribute("aria-label", `Cell ${index + 1}, empty`);
  });
}
