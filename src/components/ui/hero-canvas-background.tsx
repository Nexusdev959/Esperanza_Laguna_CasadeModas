"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

interface HeroCanvasBackgroundProps {
  themeHue?: "emerald" | "gold" | "mist" | string;
}

export function HeroCanvasBackground({ themeHue = "emerald" }: HeroCanvasBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Respiro mayor (150ms) para evitar bloqueos en el hilo principal durante navegación
    const timer = setTimeout(() => setShowCanvas(true), 150);
    return () => clearTimeout(timer);
  }, []);

  const isLight = mounted && (resolvedTheme === "light" || theme === "light");

  // ================= CANVAS PROCEDURAL (MONTAÑAS 3D, HILOS Y POLVO) =================
  useEffect(() => {
    if (!showCanvas) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const mousePos = { x: width / 2, y: height / 2 };
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.x = e.clientX;
      mousePos.y = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    const SPORE_COUNT = 25; // Reducido de 45 a 25 para rendimiento
    const spores = Array.from({ length: SPORE_COUNT }, () => ({
      x: (Math.random() - 0.5) * width * 1.5,
      y: (Math.random() - 0.5) * height * 1.5,
      z: Math.random() * 900 + 80,
      size: Math.random() * 2 + 0.9,
      isGold: Math.random() > 0.45,
    }));

    let travelSpeed = 0;

    const getTerrainHeight = (worldX: number, worldZ: number, timeVal: number) => {
      const scale1 = 0.0016;
      const scale2 = 0.0036;
      const m1 = Math.sin(worldX * scale1 + Math.cos(worldZ * scale1)) * 115;
      const m2 = Math.cos(worldX * scale2 - worldZ * scale2 + timeVal * 0.4) * 52;
      const valleyCenter = Math.exp(-Math.pow(worldX * 0.0022, 2)) * -60;
      return m1 + m2 + valleyCenter;
    };

    const render = () => {
      travelSpeed += 0.0042;

      const walkBobbing = Math.sin(travelSpeed * 18) * 3.5;
      const horizonY = height * 0.48 + walkBobbing + (mousePos.y / height - 0.5) * 28;
      const fov = 420;

      ctx.clearRect(0, 0, width, height);

      // ================= 1. RESPLANDOR DE LUZ NATURAL =================
      const ambientLight = ctx.createRadialGradient(
        width * 0.5 + (mousePos.x / width - 0.5) * 60,
        horizonY - 30,
        15,
        width * 0.5,
        horizonY,
        width * 0.65
      );

      if (isLight) {
        ambientLight.addColorStop(0, "rgba(212, 175, 55, 0.18)");
        ambientLight.addColorStop(0.4, "rgba(46, 196, 166, 0.08)");
        ambientLight.addColorStop(1, "rgba(247, 249, 248, 0)");
      } else {
        ambientLight.addColorStop(0, "rgba(46, 196, 166, 0.28)");
        ambientLight.addColorStop(0.3, "rgba(212, 175, 55, 0.14)");
        ambientLight.addColorStop(0.65, "rgba(8, 30, 24, 0.05)");
        ambientLight.addColorStop(1, "rgba(3, 6, 5, 0)");
      }
      ctx.fillStyle = ambientLight;
      ctx.fillRect(0, 0, width, height);

      // ================= 2. CORDILLERA 3D (HILOS Y TELAR) =================
      const gridZSteps = 22; // Reducido de 34 a 22 para optimización
      const gridXSteps = 24; // Reducido de 38 a 24 para optimización
      const stepZ = 30;
      const stepX = 48;

      ctx.save();
      for (let zIndex = gridZSteps; zIndex >= 2; zIndex--) {
        const currentWorldZ = zIndex * stepZ - ((travelSpeed * 380) % stepZ);
        const depthAlpha = Math.max(0, Math.min(1, (gridZSteps - zIndex) / (gridZSteps * 0.75)));

        ctx.beginPath();
        let isFirstPoint = true;

        for (let xIndex = -gridXSteps; xIndex <= gridXSteps; xIndex++) {
          const worldX = xIndex * stepX - (mousePos.x / width - 0.5) * 105;
          const worldY = getTerrainHeight(worldX, currentWorldZ + travelSpeed * 300, travelSpeed);

          const scale = fov / (fov + currentWorldZ);
          const screenX = width * 0.5 + worldX * scale;
          const screenY = horizonY + (worldY + 130) * scale;

          if (isFirstPoint) {
            ctx.moveTo(screenX, screenY);
            isFirstPoint = false;
          } else {
            ctx.lineTo(screenX, screenY);
          }
        }

        const isGoldAccent = zIndex % 3 === 0;

        if (isLight) {
          // En modo claro: hilos más brillantes y opacos para resaltar sobre la selva
          const threadAlpha = depthAlpha * (isGoldAccent ? 0.95 : 0.85);
          ctx.strokeStyle = isGoldAccent
            ? `rgba(212, 175, 55, ${threadAlpha})`
            : `rgba(21, 100, 75, ${threadAlpha})`;
        } else {
          // En modo oscuro: filamentos fosforescentes
          const threadAlpha = depthAlpha * (isGoldAccent ? 0.38 : 0.20);
          ctx.strokeStyle = isGoldAccent
            ? `rgba(235, 205, 115, ${threadAlpha})`
            : `rgba(46, 196, 166, ${threadAlpha})`;
        }

        ctx.lineWidth = Math.max(0.65, 1.4 * (1 - zIndex / gridZSteps));
        if (isGoldAccent) ctx.setLineDash([6, 8]);
        else ctx.setLineDash([]);
        ctx.stroke();

        // Relleno de volumen
        if (zIndex % 2 === 0) {
          ctx.lineTo(width, height);
          ctx.lineTo(0, height);
          ctx.closePath();
          const layerFill = ctx.createLinearGradient(0, horizonY, 0, height);
          if (isLight) {
            // En modo claro, usamos un velo blanco y dorado muy sutil para no tapar los árboles ni oscurecerlos
            layerFill.addColorStop(0, `rgba(255, 255, 250, ${depthAlpha * 0.15})`);
            layerFill.addColorStop(1, "rgba(255, 245, 220, 0.05)");
          } else {
            layerFill.addColorStop(0, "rgba(6, 16, 13, 0.22)");
            layerFill.addColorStop(1, "rgba(3, 7, 6, 0.85)");
          }
          ctx.fillStyle = layerFill;
          ctx.fill();
        }
      }
      ctx.restore();

      // ================= 3. PUNTADAS VIAJERAS ENTRE LA CORDILLERA =================
      const stitchPaths = [
        {
          // Oro vibrante
          color: isLight ? "rgba(212, 175, 55, 1)" : "rgba(235, 205, 115, 0.9)",
          glow: isLight ? "#d4af37" : "#d4af37",
          shift: -110,
        },
        {
          // Verde teal vibrante
          color: isLight ? "rgba(46, 196, 166, 1)" : "rgba(46, 196, 166, 0.9)",
          glow: isLight ? "#2ec4a6" : "#2ec4a6",
          shift: 130,
        },
      ];

      stitchPaths.forEach((st) => {
        ctx.save();
        ctx.beginPath();
        let first = true;

        for (let z = gridZSteps * stepZ; z >= 30; z -= 14) {
          const worldX = Math.sin(z * 0.003 + travelSpeed * 3) * 200 + st.shift;
          const worldY = getTerrainHeight(worldX, z + travelSpeed * 300, travelSpeed) - 15;

          const scale = fov / (fov + z);
          const sx = width * 0.5 + worldX * scale;
          const sy = horizonY + (worldY + 130) * scale;

          if (first) {
            ctx.moveTo(sx, sy);
            first = false;
          } else {
            ctx.lineTo(sx, sy);
          }
        }

        ctx.strokeStyle = st.color;
        ctx.lineWidth = 2.4;
        ctx.setLineDash([8, 6]);
        ctx.lineDashOffset = -(travelSpeed * 450);
        ctx.shadowBlur = isLight ? 6 : 12; // Resplandor visible en modo claro
        ctx.shadowColor = st.glow;
        ctx.stroke();
        ctx.restore();
      });

      // ================= 4. POLVO DE ORO Y ESPORAS FLOTANTES =================
      for (const p of spores) {
        p.z -= 2.4;
        if (p.z <= 10) {
          p.z = 900;
          p.x = (Math.random() - 0.5) * width * 1.6;
          p.y = (Math.random() - 0.5) * height * 1.4;
        }

        const scale = fov / (fov + p.z);
        const px = width * 0.5 + p.x * scale;
        const py = height * 0.5 + p.y * scale;
        const pSize = Math.max(0.6, p.size * scale * 2.8);
        const pAlpha = Math.min(1, (1 - p.z / 900) * 0.85);

        if (px >= 0 && px <= width && py >= 0 && py <= height) {
          ctx.beginPath();
          ctx.arc(px, py, pSize, 0, Math.PI * 2);
          ctx.fillStyle = isLight
            ? p.isGold ? "#d4af37" : "#2ec4a6" // Colores vivos en lugar de oscuros
            : p.isGold ? "#f5dc8c" : "#3ee2bf";
          ctx.globalAlpha = pAlpha;
          ctx.shadowBlur = isLight ? 4 : 8;
          ctx.shadowColor = p.isGold ? "#d4af37" : "#2ec4a6";
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.globalAlpha = 1;
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [themeHue, isLight, showCanvas]);

  if (!showCanvas) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.05 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 1.2, ease: [0.21, 1.02, 0.45, 1] }} // Curva súper cinematográfica
      className={`absolute inset-0 w-full h-full pointer-events-none z-10 will-change-transform origin-center ${isLight ? "mix-blend-normal opacity-90" : "mix-blend-screen"}`}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
      />
    </motion.div>
  );
}