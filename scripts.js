// Game Setup
let canvas = document.getElementById('gameCanvas');
let ctx = canvas.getContext('2d');
let hoverboard = { x: canvas.width / 2, y: canvas.height - 50, width: 50, height: 20, speed: 7 };
let cars = [];
let roadWidth = 400;
let carSpeed = 3;
let rightPressed = false, leftPressed = false;
let score = 0;

// Resize canvas to fit window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Listen to keyboard events
document.addEventListener('keydown', (event) => {
    if (event.key === "ArrowRight" || event.key === "d") rightPressed = true;
    if (event.key === "ArrowLeft" || event.key === "a") leftPressed = true;
});
document.addEventListener('keyup', (event) => {
    if (event.key === "ArrowRight" || event.key === "d") rightPressed = false;
    if (event.key === "ArrowLeft" || event.key === "a") leftPressed = false;
});

// Update game logic
function update() {
    // Clear canvas and draw background
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#7f7f7f";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw road (using a simple rectangle)
    ctx.fillStyle = "#555";
    ctx.fillRect(canvas.width / 2 - roadWidth / 2, 0, roadWidth, canvas.height);

    // Move hoverboard faster
    if (rightPressed && hoverboard.x < canvas.width - hoverboard.width) {
        hoverboard.x += hoverboard.speed;
    }
    if (leftPressed && hoverboard.x > canvas.width / 2 - roadWidth / 2) {
        hoverboard.x -= hoverboard.speed;
    }

    // Draw hoverboard (orange cube)
    ctx.fillStyle = "orange";
    ctx.fillRect(hoverboard.x, hoverboard.y, hoverboard.width, hoverboard.height);

    // Move cars and check for collision
    for (let i = 0; i < cars.length; i++) {
        let car = cars[i];
        car.y += carSpeed;

        // Draw car
        ctx.fillStyle = "red";
        ctx.fillRect(car.x, car.y, car.width, car.height);

        // Check for collision
        if (hoverboard.y < car.y + car.height && hoverboard.y + hoverboard.height > car.y &&
            hoverboard.x < car.x + car.width && hoverboard.x + hoverboard.width > car.x) {
            alert("Game Over! You hit a car.");
            resetGame();
        }

        // Remove car if it goes off-screen
        if (car.y > canvas.height) {
            cars.splice(i, 1);
            i--;
            score++;
        }
    }

    // Add new cars at random intervals
    if (Math.random() < 0.05) {
        addCar();
    }

    // Display score
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText("Score: " + score, 20, 30);

    // Request next frame
    requestAnimationFrame(update);
}

// Add a new car at a random position
function addCar() {
    let carWidth = 50;
    let carHeight = 20;
    let carX = canvas.width / 2 - roadWidth / 2 + Math.random() * roadWidth - carWidth / 2;
    cars.push({ x: carX, y: -carHeight, width: carWidth, height: carHeight });
}

// Reset the game
function resetGame() {
    cars = [];
    score = 0;
    hoverboard.x = canvas.width / 2 - hoverboard.width / 2;
    hoverboard.y = canvas.height - 50;
}

// Start the game
update();
