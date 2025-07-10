const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext("2d");

const cellSize = 20;
const cellCount = canvas.width / cellSize;

let snake = [{ x: 10, y: 10 }];
let directionX = 1;
let directionY = 0;

let fruit = {
  x: Math.floor(Math.random() * cellCount),
  y: Math.floor(Math.random() * cellCount)
};

document.addEventListener("keydown", changeDirection);

function changeDirection(event) {
  switch (event.key) {
    case "ArrowUp":
      if (directionY === 0) { directionX = 0; directionY = -1; }
      break;
    case "ArrowDown":
      if (directionY === 0) { directionX = 0; directionY = 1; }
      break;
    case "ArrowLeft":
      if (directionX === 0) { directionX = -1; directionY = 0; }
      break;
    case "ArrowRight":
      if (directionX === 0) { directionX = 1; directionY = 0; }
      break;
  }
}

function drawGame() {
  let headX = snake[0].x + directionX;
  let headY = snake[0].y + directionY;

  if (headX < 0) {
    headX = 0;
    directionX = 1;
  } else if (headX >= cellCount) {
    headX = cellCount - 1;
    directionX = -1;
  }

  if (headY < 0) {
    headY = 0;
    directionY = 1;
  } else if (headY >= cellCount) {
    headY = cellCount - 1;
    directionY = -1;
  }

  const head = { x: headX, y: headY };

  if (head.x === fruit.x && head.y === fruit.y) {
    fruit.x = Math.floor(Math.random() * cellCount);
    fruit.y = Math.floor(Math.random() * cellCount);
  } else {
    snake.pop();
  }

  snake.unshift(head);

  context.fillStyle = "#000";
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = "red";
  context.fillRect(fruit.x * cellSize, fruit.y * cellSize, cellSize, cellSize);

  context.fillStyle = "darkgreen"; 
  context.fillRect(snake[0].x * cellSize, snake[0].y * cellSize, cellSize, cellSize);

  context.fillStyle = "green"; 
  for (let i = 1; i < snake.length; i++) {
    let segment = snake[i];
    context.fillRect(segment.x * cellSize, segment.y * cellSize, cellSize, cellSize);
  }
}


setInterval(drawGame, 150);
