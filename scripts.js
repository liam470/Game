// Game Setup
let scene, camera, renderer, hoverboard, cars = [], score = 0, clock, carSpeed = 0.1;
const roadWidth = 10, hoverboardWidth = 1, hoverboardHeight = 0.3;
const carWidth = 2, carHeight = 0.5, carDepth = 1;
const maxCarSpeed = 0.2;

// Initialize the scene, camera, and renderer
function init() {
    // Create the scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111111);  // Dark background for 3D effect

    // Set up the camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Set up the renderer
    renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('gameCanvas') });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Add the hoverboard
    addHoverboard();

    // Add the road (simple large flat plane)
    addRoad();

    // Start the game loop
    clock = new THREE.Clock();
    animate();
}

// Add Hoverboard (as a simple cube)
function addHoverboard() {
    const geometry = new THREE.BoxGeometry(hoverboardWidth, hoverboardHeight, hoverboardWidth);
    const material = new THREE.MeshBasicMaterial({ color: 0xff9900 });
    hoverboard = new THREE.Mesh(geometry, material);
    hoverboard.position.set(0, -2, 0);
    scene.add(hoverboard);
}

// Add the road (for the hoverboard to move on)
function addRoad() {
    const geometry = new THREE.PlaneGeometry(roadWidth, 1000);
    const material = new THREE.MeshBasicMaterial({ color: 0x333333, side: THREE.DoubleSide });
    const road = new THREE.Mesh(geometry, material);
    road.rotation.x = Math.PI / 2;
    road.position.set(0, -5, 0);
    scene.add(road);
}

// Create a car (as a simple box)
function addCar() {
    const geometry = new THREE.BoxGeometry(carWidth, carHeight, carDepth);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const car = new THREE.Mesh(geometry, material);

    // Random position for the car
    const xPos = Math.random() * roadWidth - roadWidth / 2;
    const zPos = 10 + Math.random() * 5;  // Cars appear further away
    car.position.set(xPos, -3, zPos);
    scene.add(car);
    cars.push(car);
}

// Game update logic
function update() {
    const delta = clock.getDelta();  // Time elapsed between frames

    // Hoverboard movement (left-right with arrow keys)
    if (rightPressed && hoverboard.position.x < roadWidth / 2 - hoverboardWidth / 2) {
        hoverboard.position.x += 0.05;
    }
    if (leftPressed && hoverboard.position.x > -roadWidth / 2 + hoverboardWidth / 2) {
        hoverboard.position.x -= 0.05;
    }

    // Move cars
    cars.forEach((car, index) => {
        car.position.z -= carSpeed; // Move the car forward

        // Remove cars that go off screen
        if (car.position.z < -10) {
            scene.remove(car);
            cars.splice(index, 1);
            score += 10;  // Increase score for dodging
        }

        // Check collision
        if (car.position.z < hoverboard.position.z + hoverboardHeight / 2 && car.position.z > hoverboard.position.z - hoverboardHeight / 2 &&
            car.position.x < hoverboard.position.x + hoverboardWidth / 2 && car.position.x > hoverboard.position.x - hoverboardWidth / 2) {
            alert("Game Over! You hit a car.");
            resetGame();
        }
    });

    // Add new cars
    if (Math.random() < 0.05) {
        addCar();
    }
}

// Render the scene and update
function animate() {
    requestAnimationFrame(animate);

    update();  // Update game logic

    renderer.render(scene, camera);  // Render the scene

    // Simulate 3D motion of the camera to mimic forward movement
    camera.position.z -= 0.05;
}

// Keyboard Event Handling
let rightPressed = false, leftPressed = false;

document.addEventListener('keydown', (event) => {
    if (event.key === "ArrowRight" || event.key === "d") rightPressed = true;
    if (event.key === "ArrowLeft" || event.key === "a") leftPressed = true;
});

document.addEventListener('keyup', (event) => {
    if (event.key === "ArrowRight" || event.key === "d") rightPressed = false;
    if (event.key === "ArrowLeft" || event.key === "a") leftPressed = false;
});

// Reset the game after collision
function resetGame() {
    scene.clear();  // Clear all objects
    cars = [];
    score = 0;
    camera.position.z = 5;
    addHoverboard();
    addRoad();
}

// Initialize the game when the page is ready
init();
