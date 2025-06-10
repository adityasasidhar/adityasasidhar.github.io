// Interstellar-Themed Three.js Background
function initThreeJSBackground() {
    // Only initialize if container exists
    const container = document.getElementById('threejs-bg');
    if (!container) return;

    // Check if Three.js is loaded
    if (typeof THREE === 'undefined') {
        console.error('Three.js not loaded');
        return;
    }

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000010); // Deep space vibe

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Create glowing star-like floating elements
    const elements = [];
    const elementCount = 40;
    const geometry = new THREE.SphereGeometry(0.15, 16, 16); // Small glowing spheres

    const colors = [
        0xaaaaee,
        0xeeeeff,
        0x8899ff,
        0x555577,
        0x9999aa
    ];

    for (let i = 0; i < elementCount; i++) {
        const material = new THREE.MeshStandardMaterial({
            color: colors[Math.floor(Math.random() * colors.length)],
            emissive: 0x222244,
            metalness: 0.8,
            roughness: 0.2,
            transparent: true,
            opacity: 0.8
        });

        const element = new THREE.Mesh(geometry, material);

        element.position.x = (Math.random() - 0.5) * 40;
        element.position.y = (Math.random() - 0.5) * 40;
        element.position.z = (Math.random() - 0.5) * 40;

        element.rotation.x = Math.random() * Math.PI;
        element.rotation.y = Math.random() * Math.PI;

        const scale = 0.8 + Math.random() * 1.5;
        element.scale.set(scale, scale, scale);

        element.userData = {
            originalX: element.position.x,
            originalY: element.position.y,
            originalZ: element.position.z,
            speed: 0.2 + Math.random() * 0.3,
            rotationSpeed: 0.005 + Math.random() * 0.01
        };

        scene.add(element);
        elements.push(element);
    }

    // Ambient, spacey light
    const ambientLight = new THREE.AmbientLight(0x8888ff, 1.5); // Soft bluish glow
    scene.add(ambientLight);

    // Distant point light like a star
    const pointLight = new THREE.PointLight(0xffffff, 2, 100);
    pointLight.position.set(0, 0, 20);
    scene.add(pointLight);

    camera.position.z = 10;
    container.style.opacity = '0.4';

    function animate() {
        requestAnimationFrame(animate);

        const time = Date.now() * 0.001;

        elements.forEach(element => {
            element.position.y = element.userData.originalY + Math.sin(time * element.userData.speed) * 1.2;
            element.position.x = element.userData.originalX + Math.cos(time * element.userData.speed * 0.7) * 1.2;

            element.rotation.x += element.userData.rotationSpeed;
            element.rotation.y += element.userData.rotationSpeed * 0.8;

            const pulse = Math.sin(time * element.userData.speed * 1.2) * 0.15 + 1;
            element.scale.setScalar(pulse);
        });

        camera.position.x = Math.sin(time * 0.05) * 2;
        camera.position.z = 10 + Math.cos(time * 0.05) * 2;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    window.addEventListener('resize', onWindowResize);

    animate();
}
