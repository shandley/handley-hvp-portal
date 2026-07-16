"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const AMBIENT = 110;
const FOREGROUND = 21;
const BG = "#0a0e1a";
const dummy = new THREE.Object3D();

// Okabe-Ito palette for the foreground capsids (decorative only).
const PALETTE = ["#0072B2", "#009E73", "#D55E00", "#E69F00", "#56B4E9", "#CC79A7"];

/* ---- ambient background field (instanced, non-interactive) ---- */
type Cell = { x: number; y: number; z: number; rx: number; ry: number; rz: number; spin: number; drift: number; s: number };
function makeCells(): Cell[] {
  return Array.from({ length: AMBIENT }, () => ({
    x: (Math.random() - 0.5) * 32, y: (Math.random() - 0.5) * 20, z: -Math.random() * 46 - 6,
    rx: Math.random() * 6.28, ry: Math.random() * 6.28, rz: Math.random() * 6.28,
    spin: (Math.random() - 0.5) * 0.5, drift: 0.4 + Math.random() * 1.4,
    s: 0.18 + Math.random() ** 1.8 * 0.7,
  }));
}
function AmbientField({ animate }: { animate: boolean }) {
  const ref = useRef<THREE.InstancedMesh>(null!);
  const { invalidate } = useThree();
  const cells = useMemo(makeCells, []);
  const write = (dt: number) => {
    const mesh = ref.current; if (!mesh) return;
    for (let i = 0; i < AMBIENT; i++) {
      const c = cells[i];
      if (dt > 0) {
        c.rx += c.spin * dt * 0.5; c.ry += c.spin * dt * 0.3; c.z += c.drift * dt;
        if (c.z > 8) { c.z = -46; c.x = (Math.random() - 0.5) * 32; c.y = (Math.random() - 0.5) * 20; }
      }
      dummy.position.set(c.x, c.y, c.z);
      dummy.rotation.set(c.rx, c.ry, c.rz);
      dummy.scale.setScalar(c.s);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  };
  useLayoutEffect(() => { write(0); invalidate(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useFrame((_, delta) => { if (animate) write(Math.min(delta, 0.05)); });
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, AMBIENT]} raycast={() => null}>
      <icosahedronGeometry args={[1, 1]} />
      <meshStandardMaterial color="#cfc9bc" roughness={0.6} metalness={0.1} flatShading transparent opacity={0.9} />
    </instancedMesh>
  );
}

/* ---- foreground capsids: decorative, non-interactive ---- */
type Node = { x: number; y: number; z: number; s: number; phase: number; spin: number; color: string };
function makeNodes(): Node[] {
  const placed: Node[] = [];
  for (let i = 0; i < FOREGROUND; i++) {
    // golden-angle spiral, biased to the right of the headline, foreground depth
    const a = i * 2.399963;
    const r = 3.4 + (i % 6) * 1.15;
    let x = 4.2 + Math.cos(a) * r * 1.35;
    let y = Math.sin(a) * r * 0.82 + (i % 2 ? 0.6 : -0.6);
    const z = -5.5 + (i % 4) * 1.9 + Math.random() * 0.8;
    x = Math.max(-3.5, Math.min(15.5, x));
    y = Math.max(-7, Math.min(7, y));
    placed.push({
      x, y, z,
      s: 0.85 + Math.random() * 0.7,
      phase: Math.random() * 6.28, spin: 0.2 + Math.random() * 0.3,
      color: PALETTE[i % PALETTE.length],
    });
  }
  return placed;
}

function Capsid({ node }: { node: Node }) {
  const ref = useRef<THREE.Mesh>(null!);
  const rot = useRef({ rx: Math.random() * 6.28, ry: Math.random() * 6.28 });
  useFrame((state, delta) => {
    const m = ref.current; if (!m) return;
    rot.current.rx += node.spin * delta * 0.4;
    rot.current.ry += node.spin * delta * 0.3;
    m.rotation.set(rot.current.rx, rot.current.ry, 0);
    const bob = Math.sin(state.clock.elapsedTime * 0.5 + node.phase) * 0.22;
    m.position.set(node.x, node.y + bob, node.z);
  });
  return (
    <mesh ref={ref} position={[node.x, node.y, node.z]} raycast={() => null}>
      <icosahedronGeometry args={[1, 1]} />
      <meshStandardMaterial
        color={node.color} emissive={node.color} emissiveIntensity={0.14}
        roughness={0.34} metalness={0.22} flatShading
      />
    </mesh>
  );
}

function Capsids() {
  const nodes = useMemo(makeNodes, []);
  return <>{nodes.map((n, i) => <Capsid key={i} node={n} />)}</>;
}

function Rig({ animate }: { animate: boolean }) {
  useFrame((state) => {
    if (!animate) return;
    const cam = state.camera;
    cam.position.x += (state.pointer.x * 1.7 - cam.position.x) * 0.03;
    cam.position.y += (state.pointer.y * 1.05 - cam.position.y) * 0.03;
    cam.lookAt(0, 0, -6);
  });
  return null;
}

export default function CapsidScene({ animate }: { animate: boolean }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 12], fov: 46 }}
      dpr={[1, 1.8]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      frameloop={animate ? "always" : "demand"}
    >
      <color attach="background" args={[BG]} />
      <fogExp2 attach="fog" args={[BG, 0.05]} />
      <ambientLight intensity={0.3} />
      <directionalLight position={[9, 6, 10]} intensity={2.3} color="#E69F00" />
      <directionalLight position={[-11, -3, 3]} intensity={1.5} color="#56B4E9" />
      <directionalLight position={[2, -8, -4]} intensity={0.7} color="#CC79A7" />
      <pointLight position={[0, 0, 9]} intensity={26} distance={34} color="#fbf7ef" />
      <AmbientField animate={animate} />
      <Capsids />
      <Rig animate={animate} />
    </Canvas>
  );
}
