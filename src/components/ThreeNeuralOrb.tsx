import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface ThreeNeuralOrbProps {
  className?: string;
  isInteractive?: boolean;
}

// Module-scope math helpers for Zero Garbage Collection (GC) in render loop
const _vec3 = new THREE.Vector3();
const _targetPos = new THREE.Vector3();
const _mouseTarget = new THREE.Vector2(0, 0);

export const ThreeNeuralOrb: React.FC<ThreeNeuralOrbProps> = ({
  className = '',
  isInteractive = true,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [pulseActive, setPulseActive] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL (SwiftShader, llvmpipe) for optimal rendering configuration
    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch (e) {
        return false;
      }
    })();

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050816, 0.035);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 8.5);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    container.appendChild(renderer.domElement);

    // 2. Lighting Rig (Volumetric Studio Atmosphere)
    // Key Light (Electric Blue)
    const keyLight = new THREE.DirectionalLight(0x4361ff, 3.5);
    keyLight.position.set(5, 4, 6);
    scene.add(keyLight);

    // Rim Light (Cyan Glow)
    const rimLight = new THREE.DirectionalLight(0x00d9ff, 4.0);
    rimLight.position.set(-6, -3, -4);
    scene.add(rimLight);

    // Fill Light (Violet)
    const fillLight = new THREE.DirectionalLight(0x8b5cf6, 2.5);
    fillLight.position.set(0, 6, -3);
    scene.add(fillLight);

    // Core Orb Interior Point Light (Dynamic breathing luminescence)
    const corePointLight = new THREE.PointLight(0x00d9ff, 6.0, 14, 1.2);
    corePointLight.position.set(0, 0, 0);
    scene.add(corePointLight);

    // Cool Hemisphere Light
    const hemiLight = new THREE.HemisphereLight(0x1a2456, 0x050816, 1.5);
    scene.add(hemiLight);

    // 3. Procedural 3D Neural Orb Composite Group
    const orbMasterGroup = new THREE.Group();
    scene.add(orbMasterGroup);

    // A. Inner Luminous Core (Energy Singularity)
    const coreGeo = new THREE.IcosahedronGeometry(1.2, 4);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0x0d163a,
      emissive: 0x4361ff,
      emissiveIntensity: 0.9,
      roughness: 0.2,
      metalness: 0.85,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      wireframe: false,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    orbMasterGroup.add(coreMesh);

    // B. Inner Crystalline Wireframe Cage
    const wireframeGeo = new THREE.IcosahedronGeometry(1.22, 2);
    const wireframeMat = new THREE.MeshBasicMaterial({
      color: 0x00d9ff,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const wireframeMesh = new THREE.Mesh(wireframeGeo, wireframeMat);
    orbMasterGroup.add(wireframeMesh);

    // C. Outer Neural Geodesic Lattice (Neural Nodes & Synapses)
    const latticeGeo = new THREE.IcosahedronGeometry(1.9, 3);
    const wireGeo = new THREE.WireframeGeometry(latticeGeo);
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x4361ff,
      transparent: true,
      opacity: 0.38,
      blending: THREE.AdditiveBlending,
    });
    const latticeLines = new THREE.LineSegments(wireGeo, lineMat);
    orbMasterGroup.add(latticeLines);

    // Synapse Node Points at lattice vertices
    const nodePositions: number[] = [];
    const posAttr = latticeGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      nodePositions.push(posAttr.getX(i), posAttr.getY(i), posAttr.getZ(i));
    }
    const nodesGeo = new THREE.BufferGeometry();
    nodesGeo.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(nodePositions, 3)
    );

    // Procedural Glowing Texture for Synapse Nodes
    const createNodeSprite = () => {
      const c = document.createElement('canvas');
      c.width = 64;
      c.height = 64;
      const ctx = c.getContext('2d')!;
      const grad = ctx.createRadialGradient(32, 32, 2, 32, 32, 30);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.3, 'rgba(0, 217, 255, 0.9)');
      grad.addColorStop(0.6, 'rgba(67, 97, 255, 0.5)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(32, 32, 30, 0, Math.PI * 2);
      ctx.fill();
      const texture = new THREE.CanvasTexture(c);
      texture.colorSpace = THREE.SRGBColorSpace;
      return texture;
    };

    const nodeSprite = createNodeSprite();

    const nodesMat = new THREE.PointsMaterial({
      size: 0.16,
      map: nodeSprite,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const nodePoints = new THREE.Points(nodesGeo, nodesMat);
    orbMasterGroup.add(nodePoints);

    // D. Holographic Gimbal Rings
    const ringsGroup = new THREE.Group();
    orbMasterGroup.add(ringsGroup);

    interface RingDef {
      radius: number;
      tiltX: number;
      tiltY: number;
      tiltZ: number;
      color: number;
      speed: number;
    }

    const ringDefs: RingDef[] = [
      { radius: 2.65, tiltX: 1.1, tiltY: 0.4, tiltZ: 0.2, color: 0x00d9ff, speed: 0.4 },
      { radius: 3.1, tiltX: 0.5, tiltY: 1.2, tiltZ: -0.6, color: 0x8b5cf6, speed: -0.32 },
      { radius: 3.55, tiltX: -0.7, tiltY: 0.3, tiltZ: 1.4, color: 0x4361ff, speed: 0.25 },
    ];

    const ringMeshes: { group: THREE.Group; speed: number; satellites: THREE.Mesh[] }[] = [];

    ringDefs.forEach((def) => {
      const rGroup = new THREE.Group();
      rGroup.rotation.set(def.tiltX, def.tiltY, def.tiltZ);

      // Ring path
      const ringCurve = new THREE.EllipseCurve(0, 0, def.radius, def.radius, 0, 2 * Math.PI, false, 0);
      const points = ringCurve.getPoints(120);
      const ringGeo = new THREE.BufferGeometry().setFromPoints(points);
      const ringMat = new THREE.LineBasicMaterial({
        color: def.color,
        transparent: true,
        opacity: 0.45,
        blending: THREE.AdditiveBlending,
      });
      const ringLine = new THREE.Line(ringGeo, ringMat);
      rGroup.add(ringLine);

      // Satellite Data Nodes orbiting each ring
      const satGeo = new THREE.SphereGeometry(0.06, 12, 12);
      const satMat = new THREE.MeshBasicMaterial({
        color: def.color,
        blending: THREE.AdditiveBlending,
      });

      const satellites: THREE.Mesh[] = [];
      for (let s = 0; s < 3; s++) {
        const sat = new THREE.Mesh(satGeo, satMat);
        rGroup.add(sat);
        satellites.push(sat);
      }

      ringsGroup.add(rGroup);
      ringMeshes.push({ group: rGroup, speed: def.speed, satellites });
    });

    // E. Volumetric Ambient Neural Particle Cloud (750 orbiting synapses)
    const particleCount = isSoftwareGl ? 350 : 850;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const cBlue = new THREE.Color(0x4361ff);
    const cViolet = new THREE.Color(0x8b5cf6);
    const cCyan = new THREE.Color(0x00d9ff);
    const palette = [cBlue, cViolet, cCyan];

    for (let p = 0; p < particleCount; p++) {
      // Golden spiral distribution on sphere shell with noise depth
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 2.4 + Math.random() * 3.6;

      const px = r * Math.sin(phi) * Math.cos(theta);
      const py = r * Math.sin(phi) * Math.sin(theta);
      const pz = r * Math.cos(phi);

      particlePositions[p * 3] = px;
      particlePositions[p * 3 + 1] = py;
      particlePositions[p * 3 + 2] = pz;

      // Angular drift speed
      particleVelocities[p * 3] = (Math.random() - 0.5) * 0.005;
      particleVelocities[p * 3 + 1] = (Math.random() - 0.5) * 0.005;
      particleVelocities[p * 3 + 2] = (Math.random() - 0.5) * 0.005;

      const color = palette[Math.floor(Math.random() * palette.length)];
      particleColors[p * 3] = color.r;
      particleColors[p * 3 + 1] = color.g;
      particleColors[p * 3 + 2] = color.b;
    }

    const cloudGeo = new THREE.BufferGeometry();
    cloudGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    cloudGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const cloudMat = new THREE.PointsMaterial({
      size: 0.12,
      map: nodeSprite,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particleCloud = new THREE.Points(cloudGeo, cloudMat);
    scene.add(particleCloud);

    // 4. Mouse Tracking & Parallax Listeners
    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = 0;
    let targetRotY = 0;
    let isUserHovering = false;

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      let clientX = 0;
      let clientY = 0;
      if ('touches' in e) {
        if (e.touches.length > 0) {
          clientX = e.touches[0].clientX;
          clientY = e.touches[0].clientY;
        }
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      const rect = container.getBoundingClientRect();
      const x = (clientX - rect.left) / rect.width;
      const y = (clientY - rect.top) / rect.height;

      // Normalized coordinates (-1 to 1)
      _mouseTarget.x = (x - 0.5) * 2;
      _mouseTarget.y = (y - 0.5) * 2;
      isUserHovering = true;
    };

    const handlePointerLeave = () => {
      _mouseTarget.set(0, 0);
      isUserHovering = false;
    };

    if (isInteractive) {
      window.addEventListener('mousemove', handlePointerMove, { passive: true });
      window.addEventListener('touchmove', handlePointerMove, { passive: true });
      container.addEventListener('mouseleave', handlePointerLeave);
    }

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener('resize', handleResize);

    // 5. Animation & Pacing Loop
    let animationFrameId = 0;
    const clock = new THREE.Clock();

    const tick = () => {
      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsedTime = clock.getElapsedTime();

      // Smooth exponential damping on mouse parallax
      mouseX = THREE.MathUtils.damp(mouseX, _mouseTarget.x * 1.8, 4.0, delta);
      mouseY = THREE.MathUtils.damp(mouseY, _mouseTarget.y * 1.4, 4.0, delta);

      // Camera parallax with slight 3D roll
      camera.position.x = mouseX * 0.9;
      camera.position.y = -mouseY * 0.7;
      camera.lookAt(0, 0, 0);

      // Rotating Master Group
      orbMasterGroup.rotation.y += delta * 0.22;
      orbMasterGroup.rotation.x = Math.sin(elapsedTime * 0.3) * 0.12 + mouseY * 0.35;
      orbMasterGroup.rotation.z = Math.cos(elapsedTime * 0.25) * 0.08 - mouseX * 0.25;

      // Harmonic energy breathing of core
      const pulseHarmonic = Math.sin(elapsedTime * 2.2);
      const coreScale = 1.0 + pulseHarmonic * 0.04;
      coreMesh.scale.set(coreScale, coreScale, coreScale);
      corePointLight.intensity = 5.0 + pulseHarmonic * 2.2;
      (coreMat as THREE.MeshPhysicalMaterial).emissiveIntensity = 0.8 + pulseHarmonic * 0.4;

      // Geodesic lattice breathing & rotation
      latticeLines.rotation.y -= delta * 0.12;
      wireframeMesh.rotation.y += delta * 0.35;
      nodePoints.rotation.y -= delta * 0.12;

      // Counter-rotating rings and satellites
      ringMeshes.forEach((item, rIdx) => {
        item.group.rotation.z += delta * item.speed;
        item.group.rotation.x += delta * (item.speed * 0.4);

        // Position orbiting satellites along the ellipse perimeter
        item.satellites.forEach((sat, sIdx) => {
          const def = ringDefs[rIdx];
          const angle = elapsedTime * (item.speed * 1.5) + (sIdx * (Math.PI * 2)) / 3;
          sat.position.set(
            Math.cos(angle) * def.radius,
            Math.sin(angle) * def.radius,
            0
          );
        });
      });

      // Slowly rotate particle cloud & animate drift
      particleCloud.rotation.y += delta * 0.06;
      particleCloud.rotation.x += delta * 0.02;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(tick);
    };

    tick();
    setIsReady(true);

    // 6. Complete Lifecycle Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (isInteractive) {
        window.removeEventListener('mousemove', handlePointerMove);
        window.removeEventListener('touchmove', handlePointerMove);
        container.removeEventListener('mouseleave', handlePointerLeave);
      }

      // Dispose Geometries
      coreGeo.dispose();
      wireframeGeo.dispose();
      latticeGeo.dispose();
      wireGeo.dispose();
      nodesGeo.dispose();
      cloudGeo.dispose();

      // Dispose Materials
      coreMat.dispose();
      wireframeMat.dispose();
      lineMat.dispose();
      nodesMat.dispose();
      cloudMat.dispose();
      nodeSprite.dispose();

      ringMeshes.forEach((r) => {
        r.group.traverse((child) => {
          if (child instanceof THREE.Mesh || child instanceof THREE.Line) {
            child.geometry.dispose();
            if (Array.isArray(child.material)) {
              child.material.forEach((m) => m.dispose());
            } else {
              child.material.dispose();
            }
          }
        });
      });

      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isInteractive]);

  return (
    <div className={`relative w-full h-full overflow-hidden pointer-events-auto select-none ${className}`}>
      <div ref={mountRef} className="absolute inset-0 w-full h-full block" />
    </div>
  );
};
