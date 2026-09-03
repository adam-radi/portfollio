"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sphere, MeshDistortMaterial, OrbitControls } from "@react-three/drei";
import { Code2, Server, Sparkles, Layers, UserCheck, Box } from "lucide-react";
import * as THREE from "three";

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const handler = () => setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    handler();
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const listener = () => handler();
    mq.addEventListener("change", listener);
    return () => mq.removeEventListener("change", listener);
  }, []);
  return reduced;
}

function AnimatedShape({ reduced }: { reduced: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const wireRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current && !reduced) {
      meshRef.current.rotation.x = t * 0.2;
      meshRef.current.rotation.y = t * 0.3;
    }
    if (wireRef.current && !reduced) {
      wireRef.current.rotation.x = -t * 0.15;
      wireRef.current.rotation.y = -t * 0.25;
    }
  });

  return (
    <group scale={1.1}>
      <Float speed={2.5} rotationIntensity={1.2} floatIntensity={1.5}>
        <Sphere ref={meshRef} args={[1.5, 64, 64]}>
          <MeshDistortMaterial
            color="#FF6B2C"
            attach="material"
            distort={0.4}
            speed={2}
            roughness={0.2}
            metalness={0.8}
            clearcoat={1}
            clearcoatRoughness={0.1}
          />
        </Sphere>

        <mesh ref={wireRef} scale={1.25}>
          <icosahedronGeometry args={[1.5, 2]} />
          <meshBasicMaterial
            color="#FF7A3D"
            wireframe
            transparent
            opacity={0.25}
          />
        </mesh>
      </Float>
    </group>
  );
}

function ReducedMotionFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center text-zinc-600">
      <Sparkles className="w-8 h-8 animate-spin text-[#FF6B2C]" />
      <p className="text-sm mt-2 text-zinc-500">Motion reduced for accessibility</p>
    </div>
  );
}

export default function HeroImage() {
  const reduced = useReducedMotion();
  const [viewMode, setViewMode] = useState<"portrait" | "3d">("portrait");

  if (reduced) {
    return <ReducedMotionFallback />;
  }

  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-[340px] sm:max-w-[360px] mx-auto">
      {/* Soft Ambient Glow Backdrop */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#FF6B2C]/25 via-[#FF7A3D]/15 to-transparent rounded-3xl blur-2xl opacity-70 pointer-events-none" />

      {/* Mode Switcher Pill */}
      <div className="z-20 mb-3 inline-flex items-center p-1 rounded-full bg-zinc-900/90 border border-zinc-800 backdrop-blur-xl shadow-lg">
        <button
          type="button"
          onClick={() => setViewMode("portrait")}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all duration-300 ${
            viewMode === "portrait"
              ? "bg-[#FF6B2C] text-zinc-950 shadow-md shadow-[#FF6B2C]/30"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>Portrait</span>
        </button>
        <button
          type="button"
          onClick={() => setViewMode("3d")}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all duration-300 ${
            viewMode === "3d"
              ? "bg-[#FF6B2C] text-zinc-950 shadow-md shadow-[#FF6B2C]/30"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          <Box className="w-3.5 h-3.5" />
          <span>3D Object</span>
        </button>
      </div>

      {/* Main Container Card — Slightly smaller compact framing */}
      <div className="relative w-full aspect-[4/5] rounded-3xl border border-zinc-800/90 bg-zinc-950 shadow-2xl overflow-hidden group hover:border-[#FF6B2C]/50 transition-all duration-500">
        {viewMode === "portrait" ? (
          /* Developer Portrait View */
          <div className="relative w-full h-full">
            <Image
              src="/images/adam-radi.jpeg"
              alt="Adam Radi — Full Stack Developer & IT Specialist"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 360px"
              className="object-cover object-top group-hover:scale-103 transition-transform duration-500 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/60 via-transparent to-transparent pointer-events-none" />
          </div>
        ) : (
          /* Interactive 3D Canvas View */
          <Canvas
            camera={{ position: [0, 0, 5], fov: 50 }}
            className="w-full h-full cursor-grab active:cursor-grabbing"
          >
            <ambientLight intensity={0.7} />
            <directionalLight position={[10, 10, 5]} intensity={1.5} color="#FF8C4D" />
            <pointLight position={[-10, -10, -10]} intensity={1} color="#FF6B2C" />
            <AnimatedShape reduced={reduced} />
            <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1} />
          </Canvas>
        )}

        {/* Floating Glassmorphism Tech Badges — Restored to original position */}
        <div className="absolute top-5 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-950/85 border border-zinc-700/60 shadow-lg backdrop-blur-md transition-transform duration-300 hover:scale-105">
          <div className="p-1 rounded-lg bg-[#FF6B2C]/20 text-[#FF6B2C]">
            <Code2 className="w-3.5 h-3.5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-white leading-tight">Full Stack</p>
            <p className="text-[9px] text-zinc-400 font-medium leading-tight">Next.js & React</p>
          </div>
        </div>

        <div className="absolute bottom-5 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-950/85 border border-zinc-700/60 shadow-lg backdrop-blur-md transition-transform duration-300 hover:scale-105">
          <div className="p-1 rounded-lg bg-[#FF7A3D]/20 text-[#FF7A3D]">
            <Server className="w-3.5 h-3.5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-white leading-tight">IT Solutions</p>
            <p className="text-[9px] text-zinc-400 font-medium leading-tight">Support & Infra</p>
          </div>
        </div>

        <div className="absolute top-1/2 right-3 z-20 -translate-y-1/2 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-950/85 border border-zinc-700/60 shadow-lg backdrop-blur-md transition-transform duration-300 hover:scale-105">
          <div className="p-1 rounded-lg bg-[#FF8C4D]/20 text-[#FF8C4D]">
            <Layers className="w-3.5 h-3.5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-white leading-tight">Exocad 3D</p>
            <p className="text-[9px] text-zinc-400 font-medium leading-tight">Digital Restorations</p>
          </div>
        </div>
      </div>
    </div>
  );
}
