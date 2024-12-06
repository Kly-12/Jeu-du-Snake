const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const gridSize = 20;
const canvasSize = 400; 

let snake = [{ x: 160, y: 160 }]; 
let apple = { x: 0, y: 0 }; 
let direction = [1, 0]; 
let score = 0; 
let gameInterval;
let gameOver = false;

let touchStartX = 0;
let touchStartY = 0;

function updateGame() {
    if (gameOver) return;

    const head = { x: snake[0].x + direction[0] * gridSize, y: snake[0].y + direction[1] * gridSize };
    snake.unshift(head);

    if (head.x < 0 || head.y < 0 || head.x >= canvasSize || head.y >= canvasSize) {
        endGame();
        return;
    }

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            endGame();
            return;
        }
    }

    if (head.x === apple.x && head.y === apple.y) {
        score++;
        document.getElementById('score').textContent = `Score: ${score}`;
        generateApple();
    } else {
        snake.pop();
    }

    draw();
}

function draw() {
    ctx.clearRect(0, 0, canvasSize, canvasSize); 

    ctx.beginPath();
    ctx.arc(apple.x + gridSize / 2, apple.y + gridSize / 2, gridSize / 2, 0, Math.PI * 2);
    ctx.fillStyle = "#ff5722";
    ctx.fill();  
    ctx.closePath();

    ctx.fillStyle = "#ffeb3b";
    snake.forEach(segment => {
        ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
    });
}

function generateApple() {
    apple.x = Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;
    apple.y = Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;
}

function endGame() {
    gameOver = true;
    clearInterval(gameInterval); 
    document.getElementById('gameOverMessage').style.display = 'block';
}

function resetGame() {
    snake = [{ x: 160, y: 160 }];
    direction = [1, 0];
    score = 0;
    gameOver = false;
    document.getElementById('score').textContent = `Score: ${score}`;
    generateApple();
    document.getElementById('gameOverMessage').style.display = 'none'; 
    gameInterval = setInterval(updateGame, 100);  
}

function handleSwipe(event) {
    const touchEndX = event.changedTouches[0].clientX;
    const touchEndY = event.changedTouches[0].clientY;

    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 0 && direction[0] !== -1) {
            direction = [1, 0]; 
        } else if (diffX < 0 && direction[0] !== 1) {
            direction = [-1, 0];
        }
    } else {
        if (diffY > 0 && direction[1] !== -1) {
            direction = [0, 1]; 
        } else if (diffY < 0 && direction[1] !== 1) {
            direction = [0, -1]; 
        }
    }
}


function handleKeyboardInput(event) {
    if (gameOver) return; 
    
    if (event.key === "ArrowUp" || event.key === "w") {
        if (direction[1] !== 1) direction = [0, -1];
    } else if (event.key === "ArrowDown" || event.key === "s") {
        if (direction[1] !== -1) direction = [0, 1];
    } else if (event.key === "ArrowLeft" || event.key === "a") {
        if (direction[0] !== 1) direction = [-1, 0];
    } else if (event.key === "ArrowRight" || event.key === "d") {
        if (direction[0] !== -1) direction = [1, 0];
    }
}

document.addEventListener("keydown", handleKeyboardInput);
canvas.addEventListener("touchstart", event => {
    touchStartX = event.changedTouches[0].clientX;
    touchStartY = event.changedTouches[0].clientY;
});
canvas.addEventListener("touchend", handleSwipe);

generateApple();
gameInterval = setInterval(updateGame, 100);

document.getElementById('gameOverMessage').addEventListener('click', resetGame);