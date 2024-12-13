// Game Setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game Variables
let hoverboardX = canvas.width / 2 - 25;  // Position of the hoverboard (centered horizontally)
let hoverboardY = canvas.height - 100;    // Position of the hoverboard (near the bottom)
let hoverboardSpeed = 5;                  // Speed of the hoverboard movement
let rightPressed = false;
let leftPressed = false;

// Car Variables
let cars = [];
let carSpeed = 3;
let score = 0;

// Keyboard Events
document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

function keyDownHandler(e) {
    if (e.key === "ArrowRight" || e.key === "Right") {
        rightPressed = true;
    } else if (e.key === "ArrowLeft" || e.key === "Left") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key === "ArrowRight" || e.key === "Right") {
        rightPressed = false;
    } else if (e.key === "ArrowLeft" || e.key === "Left") {
        leftPressed = false;
    }
}

// Hoverboard Drawing
function drawHoverboard() {
    ctx.beginPath();
    ctx.rect(hoverboardX, hoverboardY, 50, 20);  // Hoverboard size and position
    ctx.fillStyle = "#ff9900";
    ctx.fill();
    ctx.closePath();
}

// Car Drawing
function drawCar(car) {
    ctx.beginPath();
    ctx.rect(car.x, car.y, 50, 20);  // Car size and position
    ctx.fillStyle = "#ff0000";
    ctx.fill();
    ctx.closePath();
}

// Generate New Cars
function generateCars() {
    if (Math.random() < 0.02) {  // Increase this value for more frequent cars
        let carX = Math.random() * (canvas.width - 50); // Random X position for the car
        let carY = -20;  // Start just above the canvas
        cars.push({ x: carX, y: carY });
    }
}

// Update Game State
function updateGame() {
    // Move the hoverboard based on keypresses
    if (rightPressed && hoverboardX < canvas.width - 50) {
        hoverboardX += hoverboardSpeed;
    } else if (leftPressed && hoverboardX > 0) {
        hoverboardX -= hoverboardSpeed;
    }

    // Update car positions and check for collisions
    for (let i = 0; i < cars.length; i++) {
        cars[i].y += carSpeed;

        // Check for collision with hoverboard
        if (cars[i].y + 20 > hoverboardY && cars[i].y < hoverboardY + 20 &&
            cars[i].x + 50 > hoverboardX && cars[i].x < hoverboardX + 50) {
            alert("Game Over! Collision detected.");
            document.location.reload();  // Restart the game on collision
        }

        if (cars[i].y > canvas.height) {
            cars.splice(i, 1);  // Remove the car if it goes off the screen
            score += 10; // Increment score for dodging a car
            i--;
        }
    }

    generateCars();
}

// Draw Score on Screen
function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#fff";
    ctx.fillText("Score: " + score, 10, 20);
}

// Clear Canvas and Draw Everything
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);  // Clear the canvas

    drawHoverboard();
    drawScore();  // Display the score

    // Draw each car
    for (let i = 0; i < cars.length; i++) {
        drawCar(cars[i]);
    }

    updateGame();  // Update game mechanics (car movement, collisions, etc.)

    requestAnimationFrame(draw);  // Keep the game running
}

// Start the Game
draw();
