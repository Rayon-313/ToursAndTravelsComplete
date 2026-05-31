import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

function PlaneAnimation({ active, scrollReveal = true }) {
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!active || isMobile) return;

    const container = containerRef.current;
    if (!container) return;

    let planeGroup = null;
    let animationId = null;
    let renderer = null;
    let cancelled = false;
    const PLANE_SCALE = 0.74;
    const FOLLOW_SPEED = 0.03;

    // Scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.5, 100);
    camera.position.set(0, 0, 20);

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const dl = new THREE.DirectionalLight(0xffffff, 1.5);
    dl.position.set(5, 10, 7);
    scene.add(dl);
    const fl = new THREE.DirectionalLight(0x8ecae6, 0.4);
    fl.position.set(-5, 0, 5);
    scene.add(fl);
    const bl = new THREE.DirectionalLight(0x4488ff, 0.3);
    bl.position.set(0, -5, -10);
    scene.add(bl);

    // Root group
    const root = new THREE.Group();
    root.scale.set(PLANE_SCALE, PLANE_SCALE, PLANE_SCALE);
    scene.add(root);

    // Container for model orientation offset
    const containerGroup = new THREE.Group();
    root.add(containerGroup);

    // Load model
    const loader = new GLTFLoader();
    loader.load(
      '/plane3d.glb',
      (gltf) => {
        const model = gltf.scene;
        containerGroup.add(model);
        planeGroup = root;
      },
      undefined,
      (err) => console.error('Plane load error:', err)
    );

    // Screen to Three.js coords
    function screenToThree(sx, sy) {
      const vFov = camera.fov * Math.PI / 180;
      const h = 2 * Math.tan(vFov / 2) * camera.position.z;
      const w = h * camera.aspect;
      return {
        x: (sx / window.innerWidth) * w - w / 2,
        y: -(sy / window.innerHeight) * h + h / 2,
      };
    }

    // Mouse position tracking
    let mouseX = window.innerWidth + 250;
    let mouseY = -150;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Animation state
    let curX = window.innerWidth + 250;
    let curY = -150;

    // Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation loop
    function animate() {
      if (cancelled) return;
      animationId = requestAnimationFrame(animate);

      if (!planeGroup) return;

      const scrollY = window.scrollY;

      // Smoothly follow mouse
      curX += (mouseX - curX) * FOLLOW_SPEED;
      curY += (mouseY - curY) * FOLLOW_SPEED;

      // Convert to 3D
      const pos = screenToThree(curX, curY);
      const targetPos = screenToThree(mouseX, mouseY);
      planeGroup.position.x = pos.x;
      planeGroup.position.y = pos.y;

      // Z depth
      const normY = curY / window.innerHeight;
      planeGroup.position.z = -1 + normY * 1.5;

      // Direction of travel
      const dir = new THREE.Vector3(
        targetPos.x - pos.x,
        targetPos.y - pos.y,
        0
      );
      if (dir.length() > 1) {
        dir.normalize();
        const targetQuat = new THREE.Quaternion();
        targetQuat.setFromUnitVectors(new THREE.Vector3(0, 0, 1), dir);
        planeGroup.quaternion.slerp(targetQuat, 0.035);
      }

      // Banking effect
      const lateralVel = Math.abs(mouseX - curX) / (Math.abs(mouseY - curY) + 1);
      const bankAmount = Math.min(0.18, lateralVel * 0.06);
      const bankDirection = Math.sign(mouseX - curX) || 0;
      const bankAngle = -bankDirection * bankAmount;
      containerGroup.rotation.x += (bankAngle - containerGroup.rotation.x) * 0.02;

      // Visibility: hidden at top, appears when scrolling
      if (scrollReveal) {
        if (scrollY < 30) {
          planeGroup.visible = false;
        } else {
          planeGroup.visible = true;
          const fadeIn = Math.min(1, (scrollY - 30) / 250);
          planeGroup.scale.setScalar(PLANE_SCALE * fadeIn);
        }
      } else {
        planeGroup.visible = true;
      }

      renderer.render(scene, camera);
    }

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelled = true;
      if (animationId) cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (renderer) {
        renderer.dispose();
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      }
    };
    }, [active, isMobile]);

  if (!active || isMobile) return null;

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 999,
      }}
    />
  );
}

export default PlaneAnimation;
