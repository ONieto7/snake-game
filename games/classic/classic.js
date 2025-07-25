const canvas = document.querySelector("#gameCanvas");
const context = canvas.getContext("2d");

const cellSize = 20;
const cellCount = canvas.width / cellSize;

const eatSound = new Audio("../../assets/sounds/eat.mp3");
const deathSound = new Audio("../../assets/sounds/death.mp3");
const backgroundMusic = new Audio("../../assets/sounds/game_music.mp3");
backgroundMusic.loop = true;

const savedVolume = localStorage.getItem('snakeVolume') || 0.2;
eatSound.volume = savedVolume;
deathSound.volume = savedVolume;
backgroundMusic.volume = savedVolume;

const appleImg = new Image();
appleImg.src = "../../assets/images/manzana.png";

const restartBtn = document.getElementById("restartBtn");

let snake = [{ x: 10, y: 10 }];
let directionX = 1;
let directionY = 0;
let score = 0;
let fruit = generateRandomPosition();
let gameOver = false;
let musicPlaying = false;
let gameSpeed = 150;
let gameInterval;

document.addEventListener("keydown", changeDirection);
restartBtn.addEventListener("click", resetGame);
gameInterval = setInterval(drawGame, gameSpeed);

function generateRandomPosition() {
  return {
    x: Math.floor(Math.random() * cellCount),
    y: Math.floor(Math.random() * (cellCount - 1)) + 1 
  };
}

function changeDirection(event) {
  const directions = {
    ArrowUp:    { x: 0, y: -1, check: () => directionY === 0 },
    ArrowDown:  { x: 0, y:  1, check: () => directionY === 0 },
    ArrowLeft:  { x: -1, y: 0, check: () => directionX === 0 },
    ArrowRight: { x:  1, y: 0, check: () => directionX === 0 }
  };

  const direction = directions[event.key];

  if (direction && direction.check()) {
    directionX = direction.x;
    directionY = direction.y;
  }

  if (!musicPlaying) {
    backgroundMusic.play();
    musicPlaying = true;
  }
}

function drawGame() {
  if (gameOver) return endGame();

  updateSnakePosition();

  if (checkCollision()) {
    gameOver = true;
    deathSound.play();
    return;
  }

  if (checkFruitCollision()) {
    eatSound.currentTime = 0;
    eatSound.play();
    score += 5;
    fruit = generateRandomPosition();
    if (score % 25 === 0) increaseSpeed();
  } else {
    snake.pop();
  }

  drawBoard();
  drawFruit();
  drawSnake();
  drawScore();
}

function updateSnakePosition() {
  let snakeHeadX = snake[0].x + directionX;
  let snakeHeadY = snake[0].y + directionY;

  snakeHeadX = Math.max(0, Math.min(cellCount - 1, snakeHeadX));
  snakeHeadY = Math.max(0, Math.min(cellCount - 1, snakeHeadY));

  snake.unshift({ x: snakeHeadX, y: snakeHeadY });
}

function checkCollision() {
  const [snakeHead, ...snakeBody] = snake;
  return snakeBody.some(segment => segment.x === snakeHead.x && segment.y === snakeHead.y);
}

function checkFruitCollision() {
  const snakeHead = snake[0];
  const fruitX = fruit.x;
  const fruitY = fruit.y;
  const snakeHeadX = snakeHead.x;
  const snakeHeadY = snakeHead.y;

  return snakeHeadX === fruitX && snakeHeadY === fruitY;
}

function drawBoard() {
  context.fillStyle = "#000";
  context.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
  context.fillStyle = "green";
  for (let i = 1; i < snake.length; i++) {
    const segment = snake[i];
    context.fillRect(segment.x * cellSize, segment.y * cellSize, cellSize, cellSize);
  }

  context.fillStyle = "darkgreen";
  context.fillRect(snake[0].x * cellSize, snake[0].y * cellSize, cellSize, cellSize);
}

function drawFruit() {
  if (appleImg.complete && appleImg.naturalWidth !== 0) {
    context.drawImage(
      appleImg,
      fruit.x * cellSize,
      fruit.y * cellSize,
      cellSize,
      cellSize
    );
  } else {
    context.fillStyle = "red";
    context.fillRect(fruit.x * cellSize, fruit.y * cellSize, cellSize, cellSize);
  }
}

function drawScore() {
  context.fillStyle = "white";
  context.font = "20px Arial";
  context.textAlign = "left";
  context.fillText("Score: " + score, 10, 20);
}

function increaseSpeed() {
  if (gameSpeed > 50) {
    gameSpeed -= 10;
    clearInterval(gameInterval);
    gameInterval = setInterval(drawGame, gameSpeed);
  }
}

function resetGame() {
  snake = [{ x: 10, y: 10 }];
  directionX = 1;
  directionY = 0;
  score = 0;
  gameOver = false;
  fruit = generateRandomPosition();
  gameSpeed = 150;

  restartBtn.style.display = "none";
  backgroundMusic.play();
  musicPlaying = true;

  clearInterval(gameInterval);
  gameInterval = setInterval(drawGame, gameSpeed);

  let menuBtn = document.getElementById("menuBtn");
  if (menuBtn) menuBtn.remove();
}

function endGame() {
  context.fillStyle = "black";
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = "white";
  context.font = "40px Arial";
  context.textAlign = "center";
  context.fillText("Game Over", canvas.width / 2, canvas.height / 2 - 20);
  context.font = "30px Arial";
  context.fillText("Score: " + score, canvas.width / 2, canvas.height / 2 + 30);

  clearInterval(gameInterval);
  restartBtn.style.display = "block";

  let menuBtn = document.getElementById("menuBtn");
  if (!menuBtn) {
    menuBtn = document.createElement("button");
    menuBtn.id = "menuBtn";
    menuBtn.textContent = "Volver al menú";
    menuBtn.className = "game-btn";
    menuBtn.onclick = function() {
      window.location.href = "../../main.html";
    };
    document.querySelector(".button-row").appendChild(menuBtn);
  }

  if (musicPlaying) {
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
    musicPlaying = false;
  }
}