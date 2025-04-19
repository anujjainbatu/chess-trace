// Firebase configuration
/*const firebaseConfig = {
  apiKey: "AIzaSyCyH9JKaic6k-QbJfTeRVPPbeF_9VtV_RM",
  authDomain: "chesstrace-42e8d.firebaseapp.com",
  databaseURL: "https://chesstrace-42e8d-default-rtdb.firebaseio.com",
  projectId: "chesstrace-42e8d",
  storageBucket: "chesstrace-42e8d.firebasestorage.app",
  messagingSenderId: "287648163519",
  appId: "1:287648163519:web:b82573eab59e45018d880a"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Listen for changes in the board state from Firebase
db.ref("chessboard").on("value", (snapshot) => {
  const data = snapshot.val();
  if (data) {
    updateBoardState(data);
  }
});

// Update the board state based on Firebase data
function updateBoardState(firebaseData) {
  // Map Firebase data to the `boardState` array
  boardState = firebaseData.map((square) => square.piece || " ");
  renderBoard();
}*/

const board = document.getElementById("chessboard");
const moveLog = document.getElementById("move-log");
const whiteCaptured = document.getElementById("white-captured");
const blackCaptured = document.getElementById("black-captured");

// Use Unicode for pieces
const pieces = {
  r: "♜", n: "♞", b: "♝", q: "♛", k: "♚", p: "♟",  // black
  R: "♖", N: "♘", B: "♗", Q: "♕", K: "♔", P: "♙"   // white
};

// Start board (simplified for demo)
let boardState = [
  "r","n","b","q","k","b","n","r",
  "p","p","p","p","p","p","p","p",
  " "," "," "," "," "," "," "," ",
  " "," "," "," "," "," "," "," ",
  " "," "," "," "," "," "," "," ",
  " "," "," "," "," "," "," "," ",
  "P","P","P","P","P","P","P","P",
  "R","N","B","Q","K","B","N","R"
];

// Track captured pieces
let capturedWhite = [];
let capturedBlack = [];

// Track move history for undo functionality
let moveHistory = [];

let isWhiteTurn = true; // Track whose turn it is
let serialNumber = 1; // Start serial number at 1

let whiteTime = 600; // Default 10 minutes in seconds
let blackTime = 600; // Default 10 minutes in seconds
let activePlayer = "white"; // White starts first
let whiteTimerInterval, blackTimerInterval;
let isGameRunning = false;

let selectedSquare = null; // Track the currently selected square

function renderBoard() {
  board.innerHTML = "";
  for (let i = 0; i < 64; i++) {
    const square = document.createElement("div");
    square.className = `square ${(Math.floor(i / 8) + i % 8) % 2 === 0 ? 'white' : 'black'}`;
    square.id = `sq-${i}`;
    square.innerText = pieces[boardState[i]] || "";
    board.appendChild(square);
  }
}

function makeMove(from, to) {
  const moving = boardState[from];
  const captured = boardState[to];

  // Save the current move to history
  moveHistory.push({ from, to, moving, captured });

  if (captured !== " ") {
    if (captured === captured.toUpperCase()) {
      capturedWhite.push(pieces[captured]);
    } else {
      capturedBlack.push(pieces[captured]);
    }
  }

  boardState[to] = moving;
  boardState[from] = " ";
  updateCaptured();
  addMoveLog(from, to, isWhiteTurn);
  renderBoard();

  // Toggle turn
  isWhiteTurn = !isWhiteTurn;
  switchTurn();
}

function undoMove() {
  if (moveHistory.length === 0) return; // No moves to undo

  const lastMove = moveHistory.pop();
  const { from, to, moving, captured } = lastMove;

  // Revert the move
  boardState[from] = moving;
  boardState[to] = captured;

  // Remove captured piece if any
  if (captured !== " ") {
    if (captured === captured.toUpperCase()) {
      capturedWhite.pop();
    } else {
      capturedBlack.pop();
    }
  }

  // Update UI
  updateCaptured();
  removeLastMoveLog();
  renderBoard();
}

function removeLastMoveLog() {
  const lastLog = moveLog.lastChild;
  if (lastLog) moveLog.removeChild(lastLog);
}

function restartGame() {
  stopTimers();
  const timeLimit = parseInt(document.getElementById("time-limit").value, 10) * 60;
  whiteTime = blackTime = timeLimit;
  updateTimerDisplay("white", whiteTime);
  updateTimerDisplay("black", blackTime);
  activePlayer = "white"; // Reset to white's turn
  isGameRunning = false;

  // Reset board state
  boardState = [
    "r", "n", "b", "q", "k", "b", "n", "r",
    "p", "p", "p", "p", "p", "p", "p", "p",
    " ", " ", " ", " ", " ", " ", " ", " ",
    " ", " ", " ", " ", " ", " ", " ", " ",
    " ", " ", " ", " ", " ", " ", " ", " ",
    " ", " ", " ", " ", " ", " ", " ", " ",
    "P", "P", "P", "P", "P", "P", "P", "P",
    "R", "N", "B", "Q", "K", "B", "N", "R"
  ];

  // Reset captured pieces
  capturedWhite = [];
  capturedBlack = [];

  // Clear move history and log
  moveHistory = [];
  moveLog.innerHTML = "";

  // Update UI
  updateCaptured();
  renderBoard();
}

function addMoveLog(from, to, isWhiteTurn) {
  const fromCoord = toChessCoord(from);
  const toCoord = toChessCoord(to);
  const movingPiece = pieces[boardState[from]] || ""; // Get the moving piece icon
  const capturedPiece = pieces[boardState[to]] || ""; // Get the captured piece icon (if any)

  if (isWhiteTurn) {
    // Create a new list item for the new turn
    const li = document.createElement("li");
    li.id = `move-${serialNumber}`;
    li.innerHTML = `<strong>${serialNumber}.</strong> ${movingPiece}${fromCoord} → ${capturedPiece}${toCoord}`;
    moveLog.appendChild(li);
  } else {
    // Append Black's move to the last list item
    const lastMove = moveLog.lastChild;
    if (lastMove) {
      lastMove.innerHTML += `, ${movingPiece}${fromCoord} → ${capturedPiece}${toCoord}`;
    }
    // Increment the serial number after Black's move
    serialNumber++;
  }
}

function toChessCoord(index) {
  const file = "abcdefgh"[index % 8];
  const rank = 8 - Math.floor(index / 8);
  return `${file}${rank}`;
}

function updateCaptured() {
  whiteCaptured.innerText = capturedWhite.join(" ");
  blackCaptured.innerText = capturedBlack.join(" ");
}

// Update the timer display
function updateTimerDisplay(player, time) {
  const minutes = Math.floor(time / 60).toString().padStart(2, "0");
  const seconds = (time % 60).toString().padStart(2, "0");
  document.getElementById(`${player}-timer`).innerText = `${minutes}:${seconds}`;
}

// Start the timer for the active player
function startTimer(player) {
  stopTimers(); // Stop any running timer
  if (player === "white") {
    whiteTimerInterval = setInterval(() => {
      if (whiteTime > 0) {
        whiteTime--;
        updateTimerDisplay("white", whiteTime);
      } else {
        clearInterval(whiteTimerInterval);
        alert("Time's up! Black wins!");
        stopTimers();
      }
    }, 1000);
  } else if (player === "black") {
    blackTimerInterval = setInterval(() => {
      if (blackTime > 0) {
        blackTime--;
        updateTimerDisplay("black", blackTime);
      } else {
        clearInterval(blackTimerInterval);
        alert("Time's up! White wins!");
        stopTimers();
      }
    }, 1000);
  }
}

// Stop both timers
function stopTimers() {
  clearInterval(whiteTimerInterval);
  clearInterval(blackTimerInterval);
}

// Switch turns and start the other player's timer
function switchTurn() {
  if (!isGameRunning) return;
  activePlayer = activePlayer === "white" ? "black" : "white";
  startTimer(activePlayer);
}

// Add click event listeners to the board
function enableInteractivePlay() {
  board.addEventListener("click", handleSquareClick);
}

// Handle square clicks
function handleSquareClick(event) {
  const square = event.target;

  // Ensure the clicked element is a square
  if (!square.classList.contains("square")) return;

  const squareIndex = parseInt(square.id.split("-")[1], 10);
  console.log(`Clicked square: ${squareIndex}, Piece: ${boardState[squareIndex]}`);

  // If no square is selected, treat this as the "from" square
  if (!selectedSquare) {
    if (isValidSelection(squareIndex)) {
      selectedSquare = squareIndex;
      highlightSquare(squareIndex);
      highlightValidMoves(squareIndex); // Highlight valid moves
      console.log(`Selected square: ${selectedSquare}`);
    } else {
      console.log("Invalid selection");
    }
  } else {
    // Treat this as the "to" square
    const from = selectedSquare;
    const to = squareIndex;

    console.log(`Attempting move from ${from} to ${to}`);
    if (isValidMove(from, to)) {
      makeMove(from, to);
      console.log(`Move made from ${from} to ${to}`);
    } else {
      console.log("Invalid move");
    }

    // Clear selection and highlights
    clearHighlights();
    selectedSquare = null;
  }
}

// Highlight all valid moves for a selected piece
function highlightValidMoves(from) {
  for (let to = 0; to < 64; to++) {
    if (isValidMove(from, to)) {
      const square = document.getElementById(`sq-${to}`);
      square.classList.add("active");
    }
  }
}

// Validate that the selected square contains a piece of the current player's color
function isValidSelection(squareIndex) {
  const piece = boardState[squareIndex];
  if (piece === " ") return false; // Empty square
  if (isWhiteTurn && piece === piece.toLowerCase()) return false; // Black piece on White's turn
  if (!isWhiteTurn && piece === piece.toUpperCase()) return false; // White piece on Black's turn
  return true;
}

// Validate the move based on chess rules
function isValidMove(from, to) {
  const piece = boardState[from];
  const target = boardState[to];
  const fromRow = Math.floor(from / 8);
  const fromCol = from % 8;
  const toRow = Math.floor(to / 8);
  const toCol = to % 8;

  // Prevent moving to the same square
  if (from === to) return false;

  // Prevent capturing your own piece
  if (target !== " ") { // Only check if the target square is not empty
    if (isWhiteTurn && target === target.toUpperCase()) return false;
    if (!isWhiteTurn && target === target.toLowerCase()) return false;
  }

  // Define movement rules for each piece
  switch (piece.toLowerCase()) {
    case "p": // Pawn
      const direction = isWhiteTurn ? -1 : 1; // White moves up (-1), Black moves down (+1)
      const startRow = isWhiteTurn ? 6 : 1; // Starting row for pawns
      const moveOne = from + direction * 8; // One square forward
      const moveTwo = from + direction * 16; // Two squares forward
      const captureLeft = from + direction * 8 - 1; // Diagonal left capture
      const captureRight = from + direction * 8 + 1; // Diagonal right capture

      // Normal single forward move
      if (to === moveOne && target === " ") return true;

      // Double move from starting position
      if (to === moveTwo && target === " " && fromRow === startRow && boardState[moveOne] === " ") return true;

      // Capturing diagonally
      if ((to === captureLeft || to === captureRight) && target !== " " && isWhiteTurn !== (target === target.toLowerCase())) {
        return true;
      }

      return false;

    case "r": // Rook
      if (fromRow === toRow || fromCol === toCol) {
        return isPathClear(from, to);
      }
      return false;

    case "n": // Knight
      const knightMoves = [
        [2, 1], [2, -1], [-2, 1], [-2, -1],
        [1, 2], [1, -2], [-1, 2], [-1, -2]
      ];
      for (const [dx, dy] of knightMoves) {
        if (toRow === fromRow + dx && toCol === fromCol + dy) return true;
      }
      return false;

    case "b": // Bishop
      if (Math.abs(fromRow - toRow) === Math.abs(fromCol - toCol)) {
        return isPathClear(from, to);
      }
      return false;

    case "q": // Queen
      if (fromRow === toRow || fromCol === toCol || Math.abs(fromRow - toRow) === Math.abs(fromCol - toCol)) {
        return isPathClear(from, to);
      }
      return false;

    case "k": // King
      if (Math.abs(fromRow - toRow) <= 1 && Math.abs(fromCol - toCol) <= 1) return true;

      // Castling logic can be added here
      return false;

    default:
      return false;
  }
}

// Helper function to check if the path between two squares is clear
function isPathClear(from, to) {
  const fromRow = Math.floor(from / 8);
  const fromCol = from % 8;
  const toRow = Math.floor(to / 8);
  const toCol = to % 8;

  const rowStep = Math.sign(toRow - fromRow);
  const colStep = Math.sign(toCol - fromCol);

  let currentRow = fromRow + rowStep;
  let currentCol = fromCol + colStep;

  while (currentRow !== toRow || currentCol !== toCol) {
    const currentIndex = currentRow * 8 + currentCol;
    if (boardState[currentIndex] !== " ") return false;

    currentRow += rowStep;
    currentCol += colStep;
  }

  return true;
}

// Highlight the selected square
function highlightSquare(squareIndex) {
  const square = document.getElementById(`sq-${squareIndex}`);
  square.classList.add("active");
}

// Clear all highlights
function clearHighlights() {
  const highlightedSquares = document.querySelectorAll(".square.active");
  highlightedSquares.forEach((square) => square.classList.remove("active"));
}

// Enable interactive play
enableInteractivePlay();

// Initial render
renderBoard();

document.getElementById("undo-button").onclick = undoMove;
document.getElementById("restart-button").onclick = restartGame;

// Start the game and initialize timers
document.getElementById("start-button").onclick = () => {
  if (isGameRunning) return; // Prevent restarting while running
  const timeLimit = parseInt(document.getElementById("time-limit").value, 10) * 60;
  if (isNaN(timeLimit) || timeLimit <= 0) {
    alert("Please enter a valid time limit in minutes.");
    return;
  }

  // Convert time limit to seconds
  whiteTime = blackTime = timeLimit;

  // Update timers on the UI
  updateTimerDisplay("white", whiteTime);
  updateTimerDisplay("black", blackTime);

  // Start White's timer
  startTimer(activePlayer);
  isGameRunning = true;
};


