"use client";

import { Environment, Float, useGLTF } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Noise } from "@react-three/postprocessing";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

interface CubeProps {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
}

function Cube({ position, rotation, scale }: CubeProps) {
  const gltf = useGLTF("/models/scene.gltf");
  const groupRef = useRef<THREE.Group>(null);

  const scene = useMemo(() => gltf.scene.clone(), [gltf.scene]);

  const vectors = useMemo(
    () => ({
      original: new THREE.Vector3(...position),
      vec: new THREE.Vector3(),
      dir: new THREE.Vector3(),
      velocity: new THREE.Vector3(0, 0, 0),
      // 1. ADICIONADO: Vetor para suavizar o movimento de "olhar"
      mouseRotation: new THREE.Vector3(0, 0, 0),
    }),
    [position]
  );

  const randomSpeed = useRef({
    x: (Math.random() - 0.5) * 0.5,
    y: (Math.random() - 0.5) * 0.5,
  });

  useEffect(() => {
    scene.traverse((child: THREE.Object3D) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.geometry) {
          mesh.geometry.computeBoundingBox();
          const size = new THREE.Vector3();
          mesh.geometry.boundingBox?.getSize(size);
          if ((size.x > 2 && size.z < 0.1) || (size.z > 2 && size.x < 0.1)) {
            mesh.visible = false;
            return;
          }
        }
        if (!mesh.material) mesh.material = new THREE.MeshStandardMaterial();
        const material = mesh.material as THREE.MeshStandardMaterial;
        material.color.set("#FFFFFF");
        material.roughness = 0.1;
        material.metalness = 0.1;
        material.emissiveIntensity = 0;
      }
    });
  }, [scene]);

  useFrame((state) => {
    if (!groupRef.current) return;

    const { original, vec, dir, velocity, mouseRotation } = vectors;
    const { width, height } = state.viewport;
    const time = state.clock.getElapsedTime(); // Tempo para o giro contínuo

    // Posição do mouse
    const mouseX = (state.pointer.x * width) / 2;
    const mouseY = (state.pointer.y * height) / 2;

    vec.set(mouseX, mouseY, original.z);
    const distance = vec.distanceTo(original);

    // --- FÍSICA DE POSIÇÃO (MANTIDA IGUAL) ---
    const repulsionRadius = 2.5;
    const repulsionStrength = 0.5;

    let targetX = original.x;
    let targetY = original.y;
    let targetZ = original.z;

    if (distance < repulsionRadius) {
      dir.subVectors(original, vec).normalize();
      const intensity = (1 - distance / repulsionRadius) * repulsionStrength;

      targetX += dir.x * intensity;
      targetY += dir.y * intensity;
      targetZ += dir.z * intensity * 0.2;
    }

    const tension = 0.007;
    const friction = 0.93;

    const displacementX = targetX - groupRef.current.position.x;
    const displacementY = targetY - groupRef.current.position.y;
    const displacementZ = targetZ - groupRef.current.position.z;

    velocity.x += displacementX * tension;
    velocity.y += displacementY * tension;
    velocity.z += displacementZ * tension;

    velocity.multiplyScalar(friction);

    groupRef.current.position.x += velocity.x;
    groupRef.current.position.y += velocity.y;
    groupRef.current.position.z += velocity.z;

    // --- NOVA LÓGICA DE ROTAÇÃO (OLHAR PARA O MOUSE) ---

    // 2. Definimos o alvo da rotação baseado na posição do mouse (Tilt)
    // Dividir por 8 controla o quão "forte" é o olhar. Menos = mais rotação.
    const targetRotX = (state.pointer.y * Math.PI) / 8;
    const targetRotY = (state.pointer.x * Math.PI) / 8;

    // 3. Suavizamos o movimento do "pescoço" do cubo (Lerp)
    const rotationSmoothness = 0.1;
    mouseRotation.x = THREE.MathUtils.lerp(
      mouseRotation.x,
      targetRotX,
      rotationSmoothness
    );
    mouseRotation.y = THREE.MathUtils.lerp(
      mouseRotation.y,
      targetRotY,
      rotationSmoothness
    );

    // 4. Aplicamos TUDO: Rotação original + Giro do Tempo + Influência do Mouse
    // Isso garante que ele gira sozinho, mas inclina na direção do mouse.
    groupRef.current.rotation.x =
      rotation[0] + time * randomSpeed.current.x - mouseRotation.x;
    groupRef.current.rotation.y =
      rotation[1] + time * randomSpeed.current.y + mouseRotation.y;
  });

  return (
    <Float speed={0} rotationIntensity={0} floatIntensity={0}>
      <group ref={groupRef} scale={scale} position={position}>
        <primitive object={scene} />
      </group>
    </Float>
  );
}

export default function CubeScene() {
  return (
    <div style={{ width: "100%", height: "100%", background: "transparent" }}>
      <Canvas
        style={{ pointerEvents: "auto" }}
        camera={{ position: [0, 0, 8], fov: 50 }}
        gl={{
          preserveDrawingBuffer: false,
          antialias: true,
          powerPreference: "high-performance",
        }}
        dpr={[1, 1.5]}
      >
        <Environment preset="studio" />
        <ambientLight intensity={1} />
        <directionalLight
          position={[5, 10, 5]}
          intensity={10}
          color="#9333ea"
          castShadow
        />
        <pointLight
          position={[-10, 0, 5]}
          intensity={15}
          color="#a855f7"
          distance={20}
          decay={1}
        />
        <pointLight
          position={[0, -5, 2]}
          intensity={5}
          color="#9333ea"
          distance={10}
        />

        <Cube position={[1.3, 0.8, 1]} rotation={[2, 2, 0]} scale={3.2} />
        <Cube position={[-1.3, -0.2, 0]} rotation={[0.5, 0.5, 0]} scale={3.6} />
        <Cube position={[0.6, -2.3, 0]} rotation={[1, 2, 0]} scale={3.7} />
        <Cube position={[-2, -2.8, 1]} rotation={[0.8, 1, 0]} scale={3.3} />
        <Cube position={[4.8, 3, -2]} rotation={[1, 0, 0.5]} scale={4.5} />
        <Cube position={[4.5, 0.2, -1]} rotation={[-0.4, 1, 0]} scale={4.4} />
        <Cube
          position={[3.7, -2.4, 0.5]}
          rotation={[0.5, 0.1, 0.5]}
          scale={3.7}
        />

        <EffectComposer>
          <Noise opacity={0.4} premultiply />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
