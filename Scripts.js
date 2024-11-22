// Get the canvas element and set up the scene
const canvas = document.getElementById('gameCanvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);

// Car setup
const carGeometry = new THREE.BoxGeometry(2, 1, 4);
const carMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const car = new THREE.Mesh(carGeometry, carMaterial);
car.position.y = -5;
scene.add(car);

// Road setup
const roadGeometry = new THREE.PlaneGeometry(500, 500);
const roadMaterial = new THREE.MeshBasicMaterial({ color: 0x333333, side: THREE.DoubleSide });
const road = new THREE.Mesh(roadGeometry, roadMaterial);
road.rotation.x = -Math.PI / 2;
road.position.y = -10;
scene.add(road);

// Add obstacles (cars) to the road
const obstacleMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const obstacles = [];
for (let i = 0; i < 10; i++) {
  const obstacle = new THREE.Mesh(carGeometry, obstacleMaterial);
  obstacle.position.set(Math.random() * 6 - 3, -5, -i * 10);
  obstacles.push(obstacle);
  scene.add(obstacle);
}

// Camera positioning
camera.position.z = 10;
camera.position.y = 3;

// Movement setup
let moveLeft = false;
let moveRight = false;
let carSpeed = 0.1;
let moveSpeed = 0.2;

document.addEventListener('keydown', (event) => {
  if (event.key === 'a' || event.key === 'ArrowLeft') moveLeft = true;
  if (event.key === 'd' || event.key === 'ArrowRight') moveRight = true;
});

document.addEventListener('keyup', (event) => {
  if (event.key === 'a' || event.key === 'ArrowLeft') moveLeft = false;
  if (event.key === 'd' || event.key === 'ArrowRight') moveRight = false;
});

// Game logic
function animate() {
  requestAnimationFrame(animate);

  // Move the player's car
  if (moveLeft && car.position.x > -3) car.position.x -= moveSpeed;
  if (moveRight && car.position.x < 3) car.position.x += moveSpeed;

  // Move obstacles (cars)
  obstacles.forEach(obstacle => {
    obstacle.position.z += carSpeed;
    if (obstacle.position.z > 0) {
      obstacle.position.z = -100;
      obstacle.position.x = Math.random() * 6 - 3;
    }
  });

  // Check for collisions
  obstacles.forEach(obstacle => {
    if (car.position.x < obstacle.position.x + 2 && car.position.x + 2 > obstacle.position.x &&
      car.position.z < obstacle.position.z + 2 && car.position.z + 2 > obstacle.position.z) {
      alert('Game Over!');
      resetGame();
    }
  });

  renderer.render(scene, camera);
}

function resetGame() {
  car.position.x = 0;
  car.position.z = -10;
  obstacles.forEach(obstacle => {
    obstacle.position.z = -Math.random() * 100;
  });
}

animate();
