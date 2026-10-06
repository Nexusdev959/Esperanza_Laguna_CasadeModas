"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useTheme } from "next-themes";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { motion } from "framer-motion";

/**
 * 1. Cámara y Caminata en Primera Persona (Walking Rig)
 * Controla cabeceo rítmico de pasos y paralaje suave con el cursor de manera responsiva.
 */
const WalkingRig = () => {
  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    
    // Movimiento rítmico y orgánico
    const bobY = Math.sin(t * 3.2) * 0.06;
    const bobX = Math.cos(t * 1.6) * 0.03;

    const targetX = state.pointer.x * 2.2 + bobX;
    const targetY = state.pointer.y * 0.8 + bobY + 0.6;

    // Amortiguación independiente del Framerate (Framerate-independent damping)
    // Esto hace que el movimiento se sienta rápido, orgánico y nunca "pesado"
    const damp = 1 - Math.exp(-8 * delta);

    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX, damp);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, damp);

    // Enfoque constante hacia el fondo del sendero
    state.camera.lookAt(0, 1.2, -25);
    state.camera.rotation.z = THREE.MathUtils.lerp(
      state.camera.rotation.z,
      -state.pointer.x * 0.05,
      damp
    );
  });
  return null;
};

/**
 * 2. Cordillera Andina de Fondo (Montañas 3D Reales)
 */
const MountainRange = ({ isLight }: { isLight: boolean }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  const mountainGeo = useMemo(() => {
    const geo = new THREE.PlaneGeometry(160, 45, 64, 24);
    const pos = geo.attributes.position;

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);

      // Ecuación de crestas y cañones montañosos
      const peak1 = Math.sin(x * 0.045) * 12.0;
      const peak2 = Math.cos(x * 0.09 + 1.2) * 6.5;
      const crag = Math.sin(x * 0.2) * 2.0;

      // Valle central despejado para el horizonte
      const valley = Math.exp(-Math.pow(x * 0.03, 2)) * -9.0;

      const zHeight = Math.max(0, (y + 20) * 0.3) * (peak1 + peak2 + crag + valley);
      pos.setZ(i, zHeight);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  const mountainMat = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: isLight ? "#1b4332" : "#061811",
      roughness: 0.95,
      metalness: 0.05,
      flatShading: true,
    });
  }, [isLight]);

  return (
    <mesh
      ref={meshRef}
      geometry={mountainGeo}
      material={mountainMat}
      position={[0, 4.0, -55]}
      rotation={[-0.12, 0, 0]}
    />
  );
};

/**
 * 3. Campo de Hierba Masivo Instanciado (2,400 Briznas de Césped Real)
 * Utiliza InstancedMesh para máximo rendimiento a 60 FPS.
 */
const InstancedGrassField = ({ isLight }: { isLight: boolean }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const count = 1200; // Reducido de 2400 para optimización masiva

  // Brizna de hierba curva y afilada en la punta
  const grassBladeGeo = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-0.06, 0);
    shape.quadraticCurveTo(-0.05, 0.45, -0.015, 0.9);
    shape.lineTo(0, 1.15); // Punta afilada
    shape.lineTo(0.015, 0.9);
    shape.quadraticCurveTo(0.05, 0.45, 0.06, 0);
    shape.closePath();

    const geo = new THREE.ShapeGeometry(shape, 3); // Reducido de 8 a 3 segmentos
    // Doblar la hierba hacia adelante con gravedad
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      pos.setZ(i, Math.pow(y * 0.55, 2) * 0.35);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Posiciones y rotaciones estáticas de la hierba
  const grassData = useMemo(() => {
    const data = [];
    for (let i = 0; i < count; i++) {
      // Dejar un sendero central abierto (-1.8 a 1.8)
      const isLeft = Math.random() > 0.5;
      const x = isLeft ? -Math.random() * 9.5 - 1.8 : Math.random() * 9.5 + 1.8;
      const z = -Math.random() * 38 + 4; // Se extiende desde el frente hasta el fondo
      const rotY = Math.random() * Math.PI * 2;
      const scale = 0.9 + Math.random() * 0.9; // Escala mayor para compensar menor cantidad
      data.push({ x, z, rotY, scale });
    }
    return data;
  }, [count]);

  const grassColors = useMemo(() => {
    return isLight
      ? ["#2d6a4f", "#40916c", "#52b788", "#74c69d", "#1b4332"]
      : ["#0b2318", "#123826", "#1a4d36", "#226346", "#071710"];
  }, [isLight]);

  useEffect(() => {
    if (!meshRef.current) return;
    const color = new THREE.Color();

    grassData.forEach((blade, i) => {
      dummy.position.set(blade.x, -2.75, blade.z);
      dummy.rotation.set(0.1, blade.rotY, 0);
      dummy.scale.set(blade.scale, blade.scale, blade.scale);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);

      // Color variado por brizna
      color.set(grassColors[i % grassColors.length]);
      meshRef.current!.setColorAt(i, color);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  }, [grassData, grassColors, dummy]);

  // Viento ondulante sobre la hierba
  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime * 1.8;

    for (let i = 0; i < count; i += 6) {
      const blade = grassData[i];
      const windTilt = Math.sin(t + blade.x * 0.4 + blade.z * 0.3) * 0.12;
      dummy.position.set(blade.x, -2.75, blade.z);
      dummy.rotation.set(0.1 + windTilt, blade.rotY, windTilt * 0.5);
      dummy.scale.set(blade.scale, blade.scale, blade.scale);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[grassBladeGeo, undefined, count]}
      // castShadow y receiveShadow eliminados para rendimiento extremo
    >
      <meshStandardMaterial
        roughness={0.7}
        metalness={0.08}
        side={THREE.DoubleSide}
      />
    </instancedMesh>
  );
};

/**
 * 4. Fronda Botánica de Sotobosque (Hojas anchas curvadas)
 */
interface FrondProps {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  isLight: boolean;
  colorVariant: number;
}

const BotanicalFrond = ({ position, rotation, scale, isLight, colorVariant }: FrondProps) => {
  const meshRef = useRef<THREE.Mesh>(null);

  const leafShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(0.1, 0.8);
    shape.bezierCurveTo(1.6, 2.5, 1.4, 5.0, 0, 7.0);
    shape.bezierCurveTo(-1.4, 5.0, -1.6, 2.5, -0.1, 0.8);
    shape.lineTo(0, 0);
    return shape;
  }, []);

  const geometry = useMemo(() => {
    const geo = new THREE.ShapeGeometry(leafShape, 6); // Reducido de 16 a 6 para optimización
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const bendX = Math.abs(x) * 0.25;
      const bendY = Math.pow(y * 0.25, 2);
      pos.setZ(i, -bendX - bendY);
    }
    geo.computeVertexNormals();
    return geo;
  }, [leafShape]);

  const colorsLight = ["#2b6b41", "#368751", "#42a362", "#50bd73", "#1f5733"];
  const colorsDark = ["#143a29", "#1b4d37", "#236145", "#2a7353", "#1b4733"];
  const baseColor = isLight ? colorsLight[colorVariant % colorsLight.length] : colorsDark[colorVariant % colorsDark.length];

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    meshRef.current.rotation.z = rotation[2] + Math.sin(t * 0.7 + position[0]) * 0.03;
    meshRef.current.rotation.x = rotation[0] + Math.cos(t * 0.6 + position[2]) * 0.04;
  });

  return (
    <mesh ref={meshRef} position={position} rotation={rotation} scale={scale} geometry={geometry}>
      <meshStandardMaterial
        color={baseColor}
        emissive={isLight ? "#000000" : "#081f16"}
        emissiveIntensity={isLight ? 0 : 0.25}
        roughness={0.75}
        metalness={0.1}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

/**
 * 5. Árboles del Bosque (Tronco con corteza + Copa escalonada)
 */
const ForestTree = ({
  position,
  scale,
  isLight,
  seed,
}: {
  position: [number, number, number];
  scale: number;
  isLight: boolean;
  seed: number;
}) => {
  const trunkHeight = 7.5 + (seed % 5) * 1.2;
  const trunkLean = (seed % 3 === 0 ? 0.08 : -0.08);

  const numLeaves = 8 + (seed % 4);

  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* Tronco con leve curvatura */}
      <mesh
        position={[trunkLean * 2, trunkHeight / 2, 0]}
        rotation={[0, 0, trunkLean]}
      >
        <cylinderGeometry args={[0.22, 0.42, trunkHeight, 8]} />
        <meshStandardMaterial
          color={isLight ? "#3d2a1d" : "#1a120c"}
          roughness={0.92}
        />
      </mesh>

      {/* Copa frondosa multicapa */}
      <group position={[trunkLean * 4, trunkHeight - 0.4, 0]}>
        {Array.from({ length: numLeaves }).map((_, i) => {
          const rotY = ((Math.PI * 2) / numLeaves) * i + seed * 0.15;
          const rotX = -0.42 - (i % 2) * 0.28;
          const leafScale = 0.85 + (i % 3) * 0.2;
          return (
            <BotanicalFrond
              key={i}
              position={[0, (i % 3) * 0.2, 0]}
              rotation={[rotX, rotY, 0]}
              scale={[leafScale, leafScale, leafScale]}
              isLight={isLight}
              colorVariant={seed + i}
            />
          );
        })}
      </group>
    </group>
  );
};

/**
 * 6. Escena Principal Integrada (Montañas + Bosque + Hierba + Luces)
 */
const JungleScene = ({ isLight }: { isLight: boolean }) => {
  // Árboles a ambos costados
  const trees = useMemo(() => {
    return Array.from({ length: 18 }).map((_, i) => { // Reducido de 28 a 18
      const isLeft = i % 2 === 0;
      const xBase = isLeft ? -Math.random() * 8.5 - 3.8 : Math.random() * 8.5 + 3.8;
      const zBase = 3 - i * 1.6;
      const yBase = -2.8;
      const scale = 0.95 + Math.random() * 0.45;
      return { position: [xBase, yBase, zBase] as [number, number, number], scale, seed: i };
    });
  }, []);

  // Arbustos bajos
  const bushes = useMemo(() => {
    return Array.from({ length: 20 }).map((_, p) => { // Reducido de 32 a 20
      const isLeft = p % 2 === 0;
      const xBase = isLeft ? -Math.random() * 3.2 - 2.2 : Math.random() * 3.2 + 2.2;
      const zBase = 5 - p * 1.1;
      const yBase = -2.75;
      const numLeaves = 4 + (p % 3);
      const plantScale = 0.5 + Math.random() * 0.35;

      const fronds = [];
      for (let l = 0; l < numLeaves; l++) {
        const rotY = ((Math.PI * 2) / numLeaves) * l;
        const rotX = -0.25 - Math.random() * 0.3;
        const leafScale = plantScale * (0.8 + Math.random() * 0.4);
        fronds.push({
          position: [xBase, yBase, zBase] as [number, number, number],
          rotation: [rotX, rotY, Math.random() * 0.2 - 0.1] as [number, number, number],
          scale: [leafScale, leafScale, leafScale] as [number, number, number],
          colorVariant: p + l,
        });
      }
      return fronds;
    }).flat();
  }, []);

  return (
    <>
      <WalkingRig />

      {/* Iluminación Atmosférica */}
      {isLight ? (
        <>
          {/* Luz solar cálida matutina */}
          <ambientLight intensity={1.3} color="#f2f9f4" />
          <directionalLight
            position={[12, 28, 12]}
            intensity={2.4}
            color="#fff4d6"
            // Sombras eliminadas para evitar el cuello de botella en la compilación de shaders (Light Mode)
          />
          {/* Luz de rebote cenital */}
          <directionalLight position={[-8, 12, -4]} intensity={0.9} color="#95d5b2" />
        </>
      ) : (
        <>
          {/* Noche misteriosa en el bosque */}
          <ambientLight intensity={0.35} color="#04120c" />
          <directionalLight position={[0, 12, 6]} intensity={1.6} color="#2ec4a6" />
          {/* Resplandor cálido en el valle lejano */}
          <pointLight position={[0, 6, -30]} intensity={95.0} distance={70} decay={1.5} color="#d4af37" />
          <spotLight position={[-12, 12, 3]} intensity={12.0} color="#2ec4a6" angle={1.0} penumbra={0.6} />
        </>
      )}

      {/* Suelo de bosque con relieve de hierba */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.82, -15]}>
        <planeGeometry args={[140, 140]} />
        <meshStandardMaterial color={isLight ? "#1b4332" : "#05140d"} roughness={0.95} />
      </mesh>

      {/* Campo de hierba denso */}
      <InstancedGrassField isLight={isLight} />

      {/* Cordillera de fondo */}
      <MountainRange isLight={isLight} />

      {/* Árboles y arbustos laterales */}
      <group>
        {trees.map((props, i) => (
          <ForestTree key={`tree-${i}`} {...props} isLight={isLight} />
        ))}
        {bushes.map((props, i) => (
          <BotanicalFrond key={`bush-${i}`} {...props} isLight={isLight} />
        ))}
      </group>

      {/* Niebla atmosférica profunda */}
      <fog
        attach="fog"
        args={[
          isLight ? "#e2ede6" : "#040706",
          isLight ? 22 : 16,
          isLight ? 75 : 60,
        ]}
      />
    </>
  );
};

/**
 * 7. Componente Contenedor Exportado
 */
export function JungleBackground() {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Mayor respiro (150ms) para que Next.js termine el enrutamiento antes de compilar WebGL
    const timer = setTimeout(() => setShowCanvas(true), 150);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return <div className="absolute inset-0 bg-[#f8faf9] dark:bg-[#040706] z-0" />;
  }

  const isLight = resolvedTheme === "light" || theme === "light";

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-0 bg-[#f8faf9] dark:bg-[#040706] transition-colors duration-1000">
      {showCanvas && (
        <motion.div
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.21, 1.02, 0.45, 1] }} // Curva súper cinematográfica
          className="absolute inset-0 origin-center"
        >
          <Canvas
            // Propiedad 'shadows' removida totalmente para evitar el lag de compilación
            gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
            dpr={[1, 1.2]} // Limitado el pixel ratio máximo a 1.2 para rendimiento
            camera={{ position: [0, 1.4, 5], fov: 52 }}
          >
            <JungleScene isLight={isLight} />
          </Canvas>
        </motion.div>
      )}

      {/* 
        Viñeta Óptica Suave: 
        Mantiene el texto editorial centrado 100% legible sin lavar los laterales.
      */}
      <div
        className={`absolute inset-0 pointer-events-none z-10 transition-colors duration-1000 ${isLight
            ? "bg-[radial-gradient(ellipse_68%_58%_at_50%_45%,rgba(248,250,249,0.85)_0%,rgba(248,250,249,0.4)_50%,transparent_90%)]"
            : "bg-[radial-gradient(ellipse_68%_58%_at_50%_45%,rgba(4,7,6,0)_0%,rgba(4,7,6,0.6)_60%,rgba(4,7,6,0.95)_100%)]"
          }`}
      />
    </div>
  );
}