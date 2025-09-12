const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
    antialias: true
});

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(50);

// Particles
const particlesGeometry = new THREE.BufferGeometry();
const particleCount = 3000;
const positions = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 100;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

const particlesMaterial = new THREE.PointsMaterial({
    color: 0x888888,
    size: 0.1,
    transparent: true
});

const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

// Lines
const linesGeometry = new THREE.BufferGeometry();
const linePositions = [];
const particlePositions = particlesGeometry.attributes.position.array;
const maxDistance = 3;

for (let i = 0; i < particleCount; i++) {
    for (let j = i + 1; j < particleCount; j++) {
        const dx = particlePositions[i * 3] - particlePositions[j * 3];
        const dy = particlePositions[i * 3 + 1] - particlePositions[j * 3 + 1];
        const dz = particlePositions[i * 3 + 2] - particlePositions[j * 3 + 2];
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (distance < maxDistance) {
            linePositions.push(particlePositions[i * 3], particlePositions[i * 3 + 1], particlePositions[i * 3 + 2]);
            linePositions.push(particlePositions[j * 3], particlePositions[j * 3 + 1], particlePositions[j * 3 + 2]);
        }
    }
}

linesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));

const linesMaterial = new THREE.LineBasicMaterial({
    color: 0x444444,
    transparent: true,
    opacity: 0.1
});

const lines = new THREE.LineSegments(linesGeometry, linesMaterial);
scene.add(lines);

// Mouse movement
let mouseX = 0;
let mouseY = 0;
document.addEventListener('mousemove', (event) => {
    mouseX = event.clientX - window.innerWidth / 2;
    mouseY = event.clientY - window.innerHeight / 2;
});

// Scroll movement
let scrollY = 0;
window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
});


// Animation loop
function animate() {
    requestAnimationFrame(animate);

    const time = Date.now() * 0.0005;
    const hue = 0.6 + Math.sin(time * 0.1) * 0.05;

    // Animate particles
    particles.rotation.x += 0.0001;
    particles.rotation.y += 0.0002;
    particles.material.size = 0.1 * (1 + Math.sin(time * 0.5) * 0.5);
    particles.material.color.setHSL(hue, 0.8, 0.5 + Math.sin(time * 0.2) * 0.2);


    // Animate lines
    lines.rotation.x += 0.0001;
    lines.rotation.y += 0.0002;
    lines.material.color.setHSL(hue, 0.8, 0.5 + Math.sin(time * 0.2) * 0.2);


    // Animate camera to mouse position
    camera.position.x += (mouseX * 0.0001 - camera.position.x) * 0.02;
    camera.position.y += (-mouseY * 0.0001 - camera.position.y) * 0.02;

    // Animate camera to scroll position
    camera.position.z = 50 - scrollY * 0.02;


    camera.lookAt(scene.position);


    renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
});
