// Game configuration for Phaser
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

let player;
let cursors;
let bullets;
let enemies;
let coins = 0;
let scoreText;
let gameOver = false;

// Preload assets
function preload() {
    this.load.image('player', 'https://example.com/player.png');  // Replace with your player image
    this.load.image('bullet', 'https://example.com/bullet.png');  // Replace with your bullet image
    this.load.image('enemy', 'https://example.com/enemy.png');  // Replace with your enemy image
}

// Create the game objects
function create() {
    // Player setup
    player = this.physics.add.sprite(400, 550, 'player').setCollideWorldBounds(true);

    // Bullet setup
    bullets = this.physics.add.group({
        defaultKey: 'bullet',
        maxSize: 10
    });

    // Enemy setup
    enemies = this.physics.add.group();

    // Create enemies at random positions
    for (let i = 0; i < 5; i++) {
        let enemy = enemies.create(Phaser.Math.Between(100, 700), Phaser.Math.Between(50, 200), 'enemy');
        enemy.setVelocity(Phaser.Math.Between(-50, 50), 0);
    }

    // Create score text
    scoreText = this.add.text(16, 16, 'Coins: 0', {
        fontSize: '32px',
        fill: '#fff'
    });

    // Cursor keys for movement
    cursors = this.input.keyboard.createCursorKeys();

    // Check for bullet collision with enemies
    this.physics.add.overlap(bullets, enemies, hitEnemy, null, this);
}

// Update the game every frame
function update() {
    if (gameOver) {
        return;
    }

    // Player movement
    if (cursors.left.isDown) {
        player.setVelocityX(-160);
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);
    } else {
        player.setVelocityX(0);
    }

    if (cursors.up.isDown) {
        player.setVelocityY(-160);
    } else if (cursors.down.isDown) {
        player.setVelocityY(160);
    } else {
        player.setVelocityY(0);
    }

    // Shoot bullets
    if (Phaser.Input.Keyboard.JustDown(cursors.space)) {
        shootBullet();
    }
}

// Function to shoot bullet
function shootBullet() {
    if (bullets.getLength() > 0) {
        const bullet = bullets.getFirstDead();
        bullet.setPosition(player.x, player.y - 20);
        bullet.setActive(true).setVisible(true);
        bullet.setVelocityY(-300);
    }
}

// Collision detection with enemy
function hitEnemy(bullet, enemy) {
    bullet.setActive(false).setVisible(false);
    enemy.setActive(false).setVisible(false);
    coins += 1; // Increase coin count
    scoreText.setText('Coins: ' + coins); // Update score text

    // Create new enemy after collision
    let newEnemy = enemies.create(Phaser.Math.Between(100, 700), Phaser.Math.Between(50, 200), 'enemy');
    newEnemy.setVelocity(Phaser.Math.Between(-50, 50), 0);
}
