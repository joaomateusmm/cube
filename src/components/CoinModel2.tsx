"use client";

import { Environment, Float, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

// --- Interfaces ---
interface ModelProps {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
}

// =========================================================
// 1. MODELO DA MOEDA (Coin) - Visual
// =========================================================
function CoinModel({ position, rotation, scale }: ModelProps) {
  const gltf = useGLTF("/models/coin.gltf");
  const scene = useMemo(() => gltf.scene.clone(), [gltf.scene]);

  useEffect(() => {
    scene.traverse((child: THREE.Object3D) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.geometry) {
          const geometry = mesh.geometry;
          geometry.computeBoundingBox();
          const boundingBox = geometry.boundingBox;
          if (boundingBox) {
            const size = new THREE.Vector3();
            boundingBox.getSize(size);
            const isLargeAndFlat =
              (size.x > 2 && size.z < 0.1) || (size.z > 2 && size.x < 0.1);
            if (isLargeAndFlat) {
              mesh.visible = false;
              return;
            }
          }
        }
        if (!mesh.material) mesh.material = new THREE.MeshStandardMaterial();
        const material = mesh.material as THREE.MeshStandardMaterial;
        if (material.color) material.color.set("#FFFFFF");
        material.roughness = 0.1;
        material.metalness = 0.1;
        if (material.emissive) material.emissive.set("#000000");
        material.emissiveIntensity = 0;
        material.needsUpdate = true;
      }
    });
  }, [scene]);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <primitive object={scene} />
    </group>
  );
}

// =========================================================
// 2. NOVO MODELO (Scene) - Visual
// =========================================================
function SceneModel({ position, rotation, scale }: ModelProps) {
  const gltf = useGLTF("/models/coin2.gltf");
  const scene = useMemo(() => gltf.scene.clone(), [gltf.scene]);

  useEffect(() => {
    scene.traverse((child: THREE.Object3D) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.geometry) {
          const geometry = mesh.geometry;
          geometry.computeBoundingBox();
          const boundingBox = geometry.boundingBox;
          if (boundingBox) {
            const size = new THREE.Vector3();
            boundingBox.getSize(size);
            const isLargeAndFlat =
              (size.x > 2 && size.z < 0.1) || (size.z > 2 && size.x < 0.1);
            if (isLargeAndFlat) {
              mesh.visible = false;
              return;
            }
          }
        }
        if (!mesh.material) mesh.material = new THREE.MeshStandardMaterial();
        const material = mesh.material as THREE.MeshStandardMaterial;
        if (material.color) material.color.set("#FFFFFF");
        material.roughness = 0.1;
        material.metalness = 0.1;
        if (material.emissive) material.emissive.set("#000000");
        material.emissiveIntensity = 0;
        material.needsUpdate = true;
      }
    });
  }, [scene]);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <primitive object={scene} />
    </group>
  );
}

// =========================================================
// CENA PRINCIPAL
// =========================================================
export default function SingleCube() {
  const sceneConfig = {
    rotation: [1.6, -0.18, 0.3] as [number, number, number],
    position: [6.2, 2.5, 0] as [number, number, number],
    scale: 6.5,
  };

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
        {/* 2. NOVO MODELO - Com animação de "Respiração" (Float)
          Usei valores ligeiramente diferentes para eles não "respirarem" em sincronia perfeita,
          o que parece mais natural.
        */}
        <Float
          speed={2}
          rotationIntensity={0.2}
          floatIntensity={0.4}
          floatingRange={[-0.2, 0.2]}
        >
          <SceneModel
            position={sceneConfig.position}
            rotation={sceneConfig.rotation}
            scale={sceneConfig.scale}
          />
        </Float>
      </Canvas>
    </div>
  );
}
