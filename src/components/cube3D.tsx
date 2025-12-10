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

  // 1. ADICIONADO: Vetor de 'velocity' para a física
  const vectors = useMemo(
    () => ({
      original: new THREE.Vector3(...position),
      vec: new THREE.Vector3(),
      dir: new THREE.Vector3(),
      velocity: new THREE.Vector3(0, 0, 0), // Velocidade atual do cubo
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

    const { original, vec, dir, velocity } = vectors;
    const { width, height } = state.viewport;

    // Posição do mouse
    const mouseX = (state.pointer.x * width) / 2;
    const mouseY = (state.pointer.y * height) / 2;

    vec.set(mouseX, mouseY, original.z);

    const distance = vec.distanceTo(original);

    // --- CONFIGURAÇÃO DA ANIMAÇÃO ---
    const repulsionRadius = 3; // Raio de ação
    const repulsionStrength = 0.5; // Força do empurrão

    let targetX = original.x;
    let targetY = original.y;
    let targetZ = original.z;

    // Se o mouse estiver perto, mudamos o alvo para longe (repulsão)
    if (distance < repulsionRadius) {
      dir.subVectors(original, vec).normalize();
      const intensity = (1 - distance / repulsionRadius) * repulsionStrength;

      targetX += dir.x * intensity;
      targetY += dir.y * intensity;
      targetZ += dir.z * intensity * 0.2;
    }

    const tension = 0.02; // Força para voltar (mais baixo = mais elástico/lento)
    const friction = 0.85; // Atrito (0.9 = escorregadio, 0.95 = pesado)

    // A força é a diferença entre onde ele está e onde devia estar
    const displacementX = targetX - groupRef.current.position.x;
    const displacementY = targetY - groupRef.current.position.y;
    const displacementZ = targetZ - groupRef.current.position.z;

    // Física: Aceleração = Força da mola
    velocity.x += displacementX * tension;
    velocity.y += displacementY * tension;
    velocity.z += displacementZ * tension;

    // Física: Aplicar atrito (para não oscilar para sempre)
    velocity.multiplyScalar(friction);

    // Aplicar a velocidade à posição atual
    groupRef.current.position.x += velocity.x;
    groupRef.current.position.y += velocity.y;
    groupRef.current.position.z += velocity.z;

    // Rotação Constante
    groupRef.current.rotation.x += randomSpeed.current.x * 0.02;
    groupRef.current.rotation.y += randomSpeed.current.y * 0.02;
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
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
        <Cube position={[-1, 0, 0]} rotation={[0.5, 0.5, 0]} scale={3.8} />
        <Cube position={[0.6, -2.3, 0]} rotation={[1, 2, 0]} scale={3.7} />
        <Cube position={[-1.8, -2.8, 1]} rotation={[0.8, 1, 0]} scale={3.3} />
        <Cube position={[4.6, 3.4, -2]} rotation={[1, 0, 0.5]} scale={4.5} />
        <Cube position={[4.5, 0.2, -1]} rotation={[-0.4, 1, 0]} scale={4.4} />
        <Cube
          position={[3.7, -2.6, 0.5]}
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
