// Set up canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

// Player object
const player = {
  x: 50,
  y: 500,
  width: 50,
  height: 50,
  speed: 5,
  dx: 0,
  dy: 0,
  gravity: 0.5,
  jumpPower: -12,
  isJumping: false,
  color: 'red',
};

// Obstacles array
const obstacles = [
  { x: 300, y: 550, width: 50, height: 50, color: 'black' },
  { x: 600, y: 450, width: 50, height: 50, color: 'black' }
];

// Boss object
const boss = {
  x: 600,
  y: 200,
  width: 100,
  height: 100,
  color: 'darkred',
  health: 100
};

// Key events
let keys = {};

// Event listeners for controls
document.addEventListener('keydown', (e) => {
  keys[e.key] = true;
});
document.addEventListener('keyup', (e) => {
  keys[e.key] = false;
});

// Move player
function movePlayer() {
  if (keys['a'] || keys['ArrowLeft']) {
    player.dx = -player.speed;
  } else if (keys['d'] || keys['ArrowRight']) {
    player.dx = player.speed;
  } else {
    player.dx = 0;
  }

  if ((keys['w'] || keys['ArrowUp']) && !player.isJumping) {
    player.dy = player.jumpPower;
    player.isJumping = true;
  }

  player.x += player.dx;
  player.y += player.dy;
  if (player.y < canvas.height - player.height) {
    player.dy += player.gravity; // Apply gravity
  } else {
    player.y = canvas.height - player.height;
    player.isJumping = false;
  }
}

// Draw the player, obstacles, and boss
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw player
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // Draw obstacles
  obstacles.forEach((obstacle) => {
    ctx.fillStyle = obstacle.color;
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
  });

  // Draw boss
  ctx.fillStyle = boss.color;
  ctx.fillRect(boss.x, boss.y, boss.width, boss.height);
  
  // Draw boss health
  ctx.fillStyle = 'white';
  ctx.font = '20px Arial';
  ctx.fillText(`Boss Health: ${boss.health}`, boss.x - 10, boss.y - 10);
}

// Check for collisions with obstacles
function checkCollisions() {
  obstacles.forEach((obstacle) => {
    if (player.x < obstacle.x + obstacle.width &&
        player.x + player.width > obstacle.x &&
        player.y < obstacle.y + obstacle.height &&
        player.y + player.height > obstacle.y) {
      // Collision detected, reset player position
      player.x = 50;
      player.y = 500;
    }
  });
}

// Boss fight mechanics
function bossFight() {
  // Basic damage system for the boss
  if (player.x < boss.x + boss.width &&
      player.x + player.width > boss.x &&
      player.y < boss.y + boss.height &&
      player.y + player.height > boss.y) {
    boss.health -= 1; // Boss takes damage when colliding with the player
  }
}

// Game loop
function gameLoop() {
  movePlayer();
  checkCollisions();
  bossFight();
  draw();
  requestAnimationFrame(gameLoop); // Keep the loop going
}

// Start the game loop
gameLoop();
