"use client";

import { Environment, Float, useGLTF } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
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

  // 1. SETUP DOS VETORES DE FÍSICA
  // Guardamos a posição original, vetores de cálculo, velocidade (para o elástico) e rotação
  const vectors = useMemo(
    () => ({
      original: new THREE.Vector3(...position),
      vec: new THREE.Vector3(),
      dir: new THREE.Vector3(),
      velocity: new THREE.Vector3(0, 0, 0), // Velocidade do movimento físico
      mouseRotation: new THREE.Vector3(0, 0, 0), // Suavização do "olhar"
    }),
    [position]
  );

  const randomSpeed = useRef({
    x: (Math.random() - 0.5) * 0.2,
    y: (Math.random() - 0.5) * 0.2,
  });

  // 2. LISTENER GLOBAL DO MOUSE (Para funcionar na tela toda)
  const globalMouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      globalMouse.current = { x, y };
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Materiais (Mantido igual)
  useEffect(() => {
    scene.traverse((child: THREE.Object3D) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.geometry) {
          mesh.geometry.computeBoundingBox();
          const size = new THREE.Vector3();
          mesh.geometry.boundingBox?.getSize(size);
          const isLargeAndFlat =
            (size.x > 2 && size.z < 0.1) || (size.z > 2 && size.x < 0.1);
          if (isLargeAndFlat) {
            mesh.visible = false;
            return;
          }
        }
        if (!mesh.material) {
          mesh.material = new THREE.MeshStandardMaterial();
        }
        const material = mesh.material as THREE.MeshStandardMaterial;
        if (material.color) material.color.set("#FFFFFF");
        material.roughness = 0.1;
        material.metalness = 0.1;
        material.emissiveIntensity = 0;
      }
    });
  }, [scene]);

  // 3. LOOP DE ANIMAÇÃO E FÍSICA
  useFrame((state) => {
    if (!groupRef.current) return;

    const { original, vec, dir, velocity, mouseRotation } = vectors;
    const { width, height } = state.viewport;
    const time = state.clock.getElapsedTime();

    // -- A. POSIÇÃO (Repulsão + Efeito Elástico) --

    // Calcular posição do mouse no mundo 3D
    const mouseX = (globalMouse.current.x * width) / 2;
    const mouseY = (globalMouse.current.y * height) / 2;

    vec.set(mouseX, mouseY, original.z);
    const distance = vec.distanceTo(original);

    // Configuração da Repulsão
    const repulsionRadius = 3; // Raio de ação
    const repulsionStrength = 0.5; // Força do empurrão

    // Definir onde o cubo "quer" estar
    let targetX = original.x;
    let targetY = original.y;
    let targetZ = original.z;

    // Se o mouse estiver perto, empurra o alvo para longe
    if (distance < repulsionRadius) {
      dir.subVectors(original, vec).normalize();
      const intensity = (1 - distance / repulsionRadius) * repulsionStrength;

      targetX += dir.x * intensity;
      targetY += dir.y * intensity;
      targetZ += dir.z * intensity * 0.2; // Empurra pouco no eixo Z
    }

    // Física de Mola (Spring Physics)
    const tension = 0.02; // Força para voltar (mais baixo = mais elástico/lento)
    const friction = 0.85; // Atrito (0.9 = escorregadio, 0.95 = pesado)

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

    // -- B. ROTAÇÃO (Olhar para o mouse) --

    // Alvo da rotação baseado na posição do mouse
    const targetRotX = (globalMouse.current.y * Math.PI) / 8;
    const targetRotY = (globalMouse.current.x * Math.PI) / 8;

    // Suavização do movimento de olhar
    const rotationSmoothness = 0.05;
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

    // Aplica: Rotação Base + Giro do Tempo + Olhar do Mouse
    groupRef.current.rotation.x =
      rotation[0] + time * randomSpeed.current.x - mouseRotation.x;
    groupRef.current.rotation.y =
      rotation[1] + time * randomSpeed.current.y + mouseRotation.y;
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <group ref={groupRef} position={position} scale={scale}>
        <primitive object={scene} />
      </group>
    </Float>
  );
}

export default function SingleCube() {
  return (
    <div
      className="pointer-events-none cursor-default"
      style={{ width: "100%", height: "100%", background: "transparent" }}
    >
      <Canvas
        className="pointer-events-none cursor-default"
        style={{ pointerEvents: "none", cursor: "default" }}
        camera={{ position: [0, 0, 8], fov: 60 }}
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
          intensity={4}
          color="#ffffff"
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

        <Cube position={[-1.5, -2.5, 0.5]} rotation={[0.5, 0, 0]} scale={3.4} />
      </Canvas>
    </div>
  );
}
