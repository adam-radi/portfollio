"use client";

import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sphere, MeshDistortMaterial, OrbitControls } from "@react-three/drei";
import { Code2, Server, Sparkles, Layers } from "lucide-react";
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
    if (meshRef.current) {
      if (!reduced) {
        meshRef.current.rotation.x = t * 0.2;
        meshRef.current.rotation.y = t * 0.3;
      }
    }
    if (wireRef.current) {
      if (!reduced) {
        wireRef.current.rotation.x = -t * 0.15;
        wireRef.current.rotation.y = -t * 0.25;
      }
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
      <Sparkles className="w-8 h-8 animate-spin" />
      <p className="text-sm mt-2 text-zinc-500">Motion reduced for accessibility</p>
    </div>
  );
}

export default function HeroImage() {
  const reduced = useReducedMotion();

  if (reduced) {
    return <ReducedMotionFallback />;
  }

  return (
    <div className="relative flex items-center justify-center w-full max-w-lg mx-auto aspect-square">
      {/* Glow Backdrop */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#FF6B2C]/30 via-[#FF7A3D]/20 to-[#FF8C4D]/30 rounded-full blur-3xl opacity-70 animate-pulse pointer-events-none" />

      {/* Main 3D Canvas Box */}
      <div className="relative w-full h-full rounded-3xl border border-zinc-800/80 bg-zinc-950/60 backdrop-blur-xl shadow-2xl overflow-hidden group hover:border-[#FF6B2C]/30 transition-all duration-500">

        {/* Background Grid Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#FF6B2C_1px,transparent_1px)] [background-size:16px_16px] opacity-15" />

        {/* 3D Scene */}
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

        {/* Floating Glassmorphism Tech Badges */}
        <div className="absolute top-6 left-6 flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-zinc-900/90 border border-zinc-700/60 shadow-lg backdrop-blur-md transition-transform duration-300 hover:scale-105">
          <div className="p-1.5 rounded-lg bg-[#FF6B2C]/20 text-[#FF6B2C]">
            <Code2 className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-semibold text-zinc-200">Full Stack</p>
            <p className="text-[10px] text-zinc-400">Next.js & React</p>
          </div>
        </div>

        <div className="absolute bottom-8 left-6 flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-zinc-900/90 border border-zinc-700/60 shadow-lg backdrop-blur-md transition-transform duration-300 hover:scale-105">
          <div className="p-1.5 rounded-lg bg-[#FF7A3D]/20 text-[#FF7A3D]">
            <Server className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-semibold text-zinc-200">IT Solutions</p>
            <p className="text-[10px] text-zinc-400">Support & Infra</p>
          </div>
        </div>

        <div className="absolute top-1/2 -right-2 -translate-y-1/2 flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-zinc-900/90 border border-zinc-700/60 shadow-lg backdrop-blur-md transition-transform duration-300 hover:scale-105">
          <div className="p-1.5 rounded-lg bg-[#FF8C4D]/20 text-[#FF8C4D]">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-semibold text-zinc-200">Exocad 3D</p>
            <p className="text-[10px] text-zinc-400">Digital Restorations</p>
          </div>
        </div>
      </div>
    </div>
  );
}