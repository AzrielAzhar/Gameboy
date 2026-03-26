document.addEventListener("DOMContentLoaded", () => {
    const ROWS = 20;
    const COLS = 10;
    const EMPTY = 0;
  
    const boardEl = document.getElementById("board");
    const nextBoardEl = document.getElementById("next-board");
    const statusText = document.getElementById("game-status");
    const scoreText = document.getElementById("score");
    const levelText = document.getElementById("level");
    const linesText = document.getElementById("lines");
    const hintText = document.getElementById("hint-text");
  
    const startBtn = document.getElementById("start-btn");
    const pauseBtn = document.getElementById("pause-btn");
    const resetBtn = document.getElementById("reset-btn");
  
    const leftBtn = document.getElementById("left-btn");
    const rightBtn = document.getElementById("right-btn");
    const downBtn = document.getElementById("down-btn");
    const rotateBtn = document.getElementById("rotate-btn");
    const hardDropBtn = document.getElementById("hard-drop-btn");
  
    let board = [];
    let boardCells = [];
    let nextCells = [];
  
    let currentPiece = null;
    let nextPiece = null;
  
    let score = 0;
    let lines = 0;
    let level = 1;
  
    let dropInterval = 800;
    let lastTime = 0;
    let dropCounter = 0;
  
    let gameStarted = false;
    let isPaused = false;
    let isGameOver = false;
  
    const SHAPES = {
      I: [
        [1, 1, 1, 1]
      ],
      O: [
        [1, 1],
        [1, 1]
      ],
      T: [
        [0, 1, 0],
        [1, 1, 1]
      ],
      S: [
        [0, 1, 1],
        [1, 1, 0]
      ],
      Z: [
        [1, 1, 0],
        [0, 1, 1]
      ],
      J: [
        [1, 0, 0],
        [1, 1, 1]
      ],
      L: [
        [0, 0, 1],
        [1, 1, 1]
      ]
    };
  
    const SHAPE_KEYS = Object.keys(SHAPES);
  
    function createEmptyBoard() {
      return Array.from({ length: ROWS }, () => Array(COLS).fill(EMPTY));
    }
  
    function createBoardCells() {
      boardEl.innerHTML = "";
      boardCells = [];
  
      for (let i = 0; i < ROWS * COLS; i++) {
        const cell = document.createElement("div");
        cell.className = "cell";
        boardEl.appendChild(cell);
        boardCells.push(cell);
      }
    }
  
    function createNextCells() {
      nextBoardEl.innerHTML = "";
      nextCells = [];
  
      for (let i = 0; i < 16; i++) {
        const cell = document.createElement("div");
        cell.className = "next-cell";
        nextBoardEl.appendChild(cell);
        nextCells.push(cell);
      }
    }
  
    function cloneMatrix(matrix) {
      return matrix.map(row => [...row]);
    }
  
    function rotateMatrix(matrix) {
      const rows = matrix.length;
      const cols = matrix[0].length;
      const rotated = Array.from({ length: cols }, () => Array(rows).fill(0));
  
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          rotated[x][rows - 1 - y] = matrix[y][x];
        }
      }
  
      return rotated;
    }
  
    function randomPiece() {
      const key = SHAPE_KEYS[Math.floor(Math.random() * SHAPE_KEYS.length)];
      const shape = cloneMatrix(SHAPES[key]);
  
      return {
        key,
        shape,
        x: Math.floor((COLS - shape[0].length) / 2),
        y: 0
      };
    }
  
    function resetStats() {
      score = 0;
      lines = 0;
      level = 1;
      dropInterval = 800;
      updateStats();
    }
  
    function updateStats() {
      scoreText.textContent = String(score).padStart(4, "0");
      linesText.textContent = String(lines).padStart(2, "0");
      levelText.textContent = String(level).padStart(2, "0");
    }
  
    function updateStatus(text) {
      statusText.textContent = text;
    }
  
    function collides(piece, testX = piece.x, testY = piece.y, testShape = piece.shape) {
      for (let y = 0; y < testShape.length; y++) {
        for (let x = 0; x < testShape[y].length; x++) {
          if (!testShape[y][x]) continue;
  
          const boardX = testX + x;
          const boardY = testY + y;
  
          if (boardX < 0 || boardX >= COLS || boardY >= ROWS) {
            return true;
          }
  
          if (boardY >= 0 && board[boardY][boardX] !== EMPTY) {
            return true;
          }
        }
      }
  
      return false;
    }
  
    function mergePiece(piece) {
      piece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
          if (!value) return;
  
          const boardY = piece.y + y;
          const boardX = piece.x + x;
  
          if (boardY >= 0 && boardY < ROWS && boardX >= 0 && boardX < COLS) {
            board[boardY][boardX] = 1;
          }
        });
      });
    }
  
    function clearLines() {
      let cleared = 0;
  
      for (let y = ROWS - 1; y >= 0; y--) {
        if (board[y].every(cell => cell !== EMPTY)) {
          board.splice(y, 1);
          board.unshift(Array(COLS).fill(EMPTY));
          cleared++;
          y++;
        }
      }
  
      if (cleared > 0) {
        const lineScoreMap = {
          1: 100,
          2: 300,
          3: 500,
          4: 800
        };
  
        score += (lineScoreMap[cleared] || 0) * level;
        lines += cleared;
        level = Math.floor(lines / 10) + 1;
        dropInterval = Math.max(150, 800 - (level - 1) * 60);
        updateStats();
      }
    }
  
    function spawnPiece() {
      currentPiece = nextPiece || randomPiece();
      nextPiece = randomPiece();
  
      currentPiece.x = Math.floor((COLS - currentPiece.shape[0].length) / 2);
      currentPiece.y = 0;
  
      renderNextPiece();
  
      if (collides(currentPiece)) {
        gameOver();
        return;
      }
  
      render();
    }
  
    function movePiece(direction) {
      if (!gameStarted || isPaused || isGameOver || !currentPiece) return;
  
      const newX = currentPiece.x + direction;
      if (!collides(currentPiece, newX, currentPiece.y)) {
        currentPiece.x = newX;
        render();
      }
    }
  
    function softDrop() {
      if (!gameStarted || isPaused || isGameOver || !currentPiece) return;
      drop();
    }
  
    function hardDrop() {
      if (!gameStarted || isPaused || isGameOver || !currentPiece) return;
  
      while (!collides(currentPiece, currentPiece.x, currentPiece.y + 1)) {
        currentPiece.y++;
      }
  
      lockPiece();
      render();
    }
  
    function rotatePiece() {
      if (!gameStarted || isPaused || isGameOver || !currentPiece) return;
  
      const rotated = rotateMatrix(currentPiece.shape);
  
      if (!collides(currentPiece, currentPiece.x, currentPiece.y, rotated)) {
        currentPiece.shape = rotated;
        render();
        return;
      }
  
      if (!collides(currentPiece, currentPiece.x - 1, currentPiece.y, rotated)) {
        currentPiece.x -= 1;
        currentPiece.shape = rotated;
        render();
        return;
      }
  
      if (!collides(currentPiece, currentPiece.x + 1, currentPiece.y, rotated)) {
        currentPiece.x += 1;
        currentPiece.shape = rotated;
        render();
      }
    }
  
    function drop() {
      if (!currentPiece) return;
  
      if (collides(currentPiece, currentPiece.x, currentPiece.y + 1)) {
        lockPiece();
      } else {
        currentPiece.y++;
      }
  
      render();
    }
  
    function lockPiece() {
      mergePiece(currentPiece);
      clearLines();
      spawnPiece();
    }
  
    function gameOver() {
      isGameOver = true;
      gameStarted = false;
      currentPiece = null;
      updateStatus("OVER");
      hintText.textContent = "Game over. Press Start or Reset to play again.";
      render();
    }
  
    function togglePause() {
      if (!gameStarted || isGameOver) return;
  
      isPaused = !isPaused;
      updateStatus(isPaused ? "PAUSE" : "PLAY");
      pauseBtn.textContent = isPaused ? "Resume" : "Pause";
      hintText.textContent = isPaused
        ? "Paused. Press P or Resume to continue."
        : "← → move • ↑ rotate • ↓ drop • space hard drop • P pause";
    }
  
    function render() {
      boardCells.forEach(cell => {
        cell.className = "cell";
      });
  
      for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
          const index = y * COLS + x;
          if (board[y][x] !== EMPTY) {
            boardCells[index].classList.add("filled");
          }
        }
      }
  
      if (currentPiece) {
        currentPiece.shape.forEach((row, y) => {
          row.forEach((value, x) => {
            if (!value) return;
  
            const boardX = currentPiece.x + x;
            const boardY = currentPiece.y + y;
  
            if (boardY >= 0 && boardY < ROWS && boardX >= 0 && boardX < COLS) {
              const index = boardY * COLS + boardX;
              boardCells[index].classList.add("active");
            }
          });
        });
      }
    }
  
    function renderNextPiece() {
      nextCells.forEach(cell => {
        cell.className = "next-cell";
      });
  
      if (!nextPiece) return;
  
      const shape = nextPiece.shape;
      const offsetY = Math.floor((4 - shape.length) / 2);
      const offsetX = Math.floor((4 - shape[0].length) / 2);
  
      shape.forEach((row, y) => {
        row.forEach((value, x) => {
          if (!value) return;
  
          const nx = offsetX + x;
          const ny = offsetY + y;
          const index = ny * 4 + nx;
  
          if (nextCells[index]) {
            nextCells[index].classList.add("active");
          }
        });
      });
    }
  
    function startGame() {
      board = createEmptyBoard();
      currentPiece = null;
      nextPiece = null;
  
      resetStats();
  
      gameStarted = true;
      isPaused = false;
      isGameOver = false;
      dropCounter = 0;
      lastTime = 0;
  
      pauseBtn.textContent = "Pause";
      updateStatus("PLAY");
      hintText.textContent = "← → move • ↑ rotate • ↓ drop • space hard drop • P pause";
  
      nextPiece = randomPiece();
      spawnPiece();
      render();
    }
  
    function resetGame() {
      board = createEmptyBoard();
      currentPiece = null;
      nextPiece = null;
      gameStarted = false;
      isPaused = false;
      isGameOver = false;
      dropCounter = 0;
      lastTime = 0;
  
      pauseBtn.textContent = "Pause";
      updateStatus("READY");
      hintText.textContent = "Press Start to begin real Tetris mode.";
      resetStats();
      render();
      renderNextPiece();
    }
  
    function update(time = 0) {
      if (!lastTime) {
        lastTime = time;
      }
  
      const deltaTime = time - lastTime;
      lastTime = time;
  
      if (gameStarted && !isPaused && !isGameOver && currentPiece) {
        dropCounter += deltaTime;
  
        if (dropCounter >= dropInterval) {
          drop();
          dropCounter = 0;
        }
      }
  
      requestAnimationFrame(update);
    }
  
    function bindTouchControl(button, action) {
      if (!button) return;
  
      button.addEventListener("click", action);
      button.addEventListener("touchstart", (event) => {
        event.preventDefault();
        action();
      }, { passive: false });
    }
  
    document.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        movePiece(-1);
      }
  
      if (event.key === "ArrowRight") {
        event.preventDefault();
        movePiece(1);
      }
  
      if (event.key === "ArrowDown") {
        event.preventDefault();
        softDrop();
      }
  
      if (event.key === "ArrowUp") {
        event.preventDefault();
        rotatePiece();
      }
  
      if (event.code === "Space") {
        event.preventDefault();
        hardDrop();
      }
  
      if (event.key.toLowerCase() === "p") {
        event.preventDefault();
        togglePause();
      }
    });
  
    startBtn.addEventListener("click", startGame);
    pauseBtn.addEventListener("click", togglePause);
    resetBtn.addEventListener("click", resetGame);
  
    bindTouchControl(leftBtn, () => movePiece(-1));
    bindTouchControl(rightBtn, () => movePiece(1));
    bindTouchControl(downBtn, softDrop);
    bindTouchControl(rotateBtn, rotatePiece);
    bindTouchControl(hardDropBtn, hardDrop);
  
    createBoardCells();
    createNextCells();
    resetGame();
    requestAnimationFrame(update);
  });