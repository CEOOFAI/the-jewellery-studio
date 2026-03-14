import { useRef, useMemo, useState, Component } from "react";
import type { ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

/* ──────────── CONSTANTS (exact match to original) ──────────── */
const R = 1.15; // ring center radius
const r = 0.09; // tube radius
const bandTopY = R + r; // 1.24
const galleryR = 0.16;
const galleryH = 0.10;
const galleryBottomY = bandTopY - 0.03;
const girdleR = 0.40;
const tableR = 0.20;
const pavH = 0.35;
const crownH = 0.22;
const settingH = 0.38;
const girdleY = galleryBottomY + galleryH + settingH; // ≈ 1.69

/* ──────────── GOLD MATERIAL ──────────── */
function useGoldMaterial() {
  return useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(0.85, 0.7, 0.42),
        metalness: 1.0,
        roughness: 0.10,
        envMapIntensity: 2.0,
      }),
    []
  );
}

/* ──────────── RING BAND ──────────── */
function RingBand() {
  const material = useGoldMaterial();
  const geometry = useMemo(() => {
    const nSeg = 256;
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < nSeg; i++) {
      const t = (i / nSeg) * Math.PI * 2;
      pts.push(new THREE.Vector3(R * Math.cos(t), R * Math.sin(t), 0));
    }
    const path = new THREE.CatmullRomCurve3(pts, true);
    return new THREE.TubeGeometry(path, 200, r, 32, true);
  }, []);

  return <mesh geometry={geometry} material={material} />;
}

/* ──────────── GALLERY / BASKET ──────────── */
function Gallery() {
  const material = useGoldMaterial();
  return (
    <mesh
      position={[0, galleryBottomY + galleryH / 2, 0]}
      material={material}
    >
      <cylinderGeometry args={[galleryR, galleryR + 0.04, galleryH, 24]} />
    </mesh>
  );
}

/* ──────────── 6 PRONG ARMS ──────────── */
function Prongs() {
  const material = useGoldMaterial();
  const prongs = useMemo(() => {
    const result: THREE.TubeGeometry[] = [];
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const baseR2 = galleryR * 0.80;
      const tipR2 = girdleR * 0.90;

      const base = new THREE.Vector3(
        Math.cos(a) * baseR2,
        galleryBottomY + galleryH * 0.6,
        Math.sin(a) * baseR2
      );
      const mid = new THREE.Vector3(
        Math.cos(a) * (baseR2 + tipR2) * 0.52,
        (base.y + girdleY + crownH * 0.3) * 0.50,
        Math.sin(a) * (baseR2 + tipR2) * 0.52
      );
      const tip = new THREE.Vector3(
        Math.cos(a) * tipR2,
        girdleY + crownH * 0.35,
        Math.sin(a) * tipR2
      );

      const curve = new THREE.CatmullRomCurve3([base, mid, tip]);
      result.push(new THREE.TubeGeometry(curve, 20, 0.028, 8, false));
    }
    return result;
  }, []);

  return (
    <>
      {prongs.map((geo, i) => (
        <mesh key={i} geometry={geo} material={material} />
      ))}
    </>
  );
}

/* ──────────── DIAMOND ──────────── */
function Diamond() {
  const diamondMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(0.92, 0.95, 1.0),
        metalness: 0.0,
        roughness: 0.0,
        transmission: 0.50,
        thickness: 1.5,
        ior: 2.42,
        envMapIntensity: 5.0,
        clearcoat: 1.0,
        clearcoatRoughness: 0.0,
        specularIntensity: 5.0,
        specularColor: new THREE.Color(1, 1, 1),
        attenuationColor: new THREE.Color(0.82, 0.86, 1.0),
        attenuationDistance: 0.06,
        reflectivity: 1.0,
        sheen: 0.4,
        sheenColor: new THREE.Color(0.9, 0.95, 1.0),
      }),
    []
  );

  const tableMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0.05,
        roughness: 0.0,
        transmission: 0.4,
        ior: 2.42,
        envMapIntensity: 6.0,
        clearcoat: 1.0,
        specularIntensity: 5.0,
      }),
    []
  );

  return (
    <>
      {/* Pavilion (inverted cone) */}
      <mesh
        position={[0, girdleY - pavH / 2, 0]}
        rotation={[Math.PI, 0, 0]}
        material={diamondMat}
      >
        <coneGeometry args={[girdleR, pavH, 16]} />
      </mesh>

      {/* Crown (tapered cylinder) */}
      <mesh position={[0, girdleY + crownH / 2, 0]} material={diamondMat}>
        <cylinderGeometry args={[tableR, girdleR, crownH, 16]} />
      </mesh>

      {/* Table facet */}
      <mesh
        position={[0, girdleY + crownH + 0.005, 0]}
        material={tableMat}
      >
        <cylinderGeometry args={[tableR, tableR, 0.01, 16]} />
      </mesh>
    </>
  );
}

/* ──────────── SPARKLE PARTICLES (exact match) ──────────── */
function SparkleParticles() {
  const meshRef = useRef<THREE.Points>(null);

  const { positions, speeds } = useMemo(() => {
    const count = 50;
    const pos = new Float32Array(count * 3);
    const spd: { x: number; y: number; z: number }[] = [];

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const rr = 2.0 + Math.random() * 2.5;
      pos[i * 3] = rr * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = rr * Math.cos(phi);
      pos[i * 3 + 2] = rr * Math.sin(phi) * Math.sin(theta);
      spd.push({
        x: (Math.random() - 0.5) * 0.002,
        y: (Math.random() - 0.5) * 0.0015,
        z: (Math.random() - 0.5) * 0.002,
      });
    }
    return { positions: pos, speeds: spd };
  }, []);

  useFrame(() => {
    if (!meshRef.current) return;
    const posAttr = meshRef.current.geometry.attributes
      .position as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;

    for (let i = 0; i < 50; i++) {
      arr[i * 3] += speeds[i].x;
      arr[i * 3 + 1] += speeds[i].y;
      arr[i * 3 + 2] += speeds[i].z;

      const px = arr[i * 3],
        py = arr[i * 3 + 1],
        pz = arr[i * 3 + 2];
      if (Math.sqrt(px * px + py * py + pz * pz) > 5) {
        const th = Math.random() * Math.PI * 2;
        const ph = Math.acos(2 * Math.random() - 1);
        const rr = 2.0 + Math.random();
        arr[i * 3] = rr * Math.sin(ph) * Math.cos(th);
        arr[i * 3 + 1] = rr * Math.cos(ph);
        arr[i * 3 + 2] = rr * Math.sin(ph) * Math.sin(th);
      }
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={50}
        />
      </bufferGeometry>
      <pointsMaterial
        color={0xc9a96e}
        size={0.02}
        transparent
        opacity={0.28}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

/* ──────────── ORBITING LIGHTS (exact match) ──────────── */
function Lights() {
  const sparkleRef = useRef<THREE.PointLight>(null);
  const fireRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (sparkleRef.current) {
      sparkleRef.current.position.x = Math.sin(t * 0.6) * 3;
      sparkleRef.current.position.z = Math.cos(t * 0.6) * 3;
      sparkleRef.current.position.y = 3 + Math.sin(t * 0.3) * 0.5;
    }
    if (fireRef.current) {
      fireRef.current.position.x = Math.cos(t * 0.4) * 2.5;
      fireRef.current.position.z = Math.sin(t * 0.4) * 2.5;
    }
  });

  return (
    <>
      {/* Fill light */}
      <directionalLight
        intensity={0.5}
        color={0xfff8ee}
        position={[-3, 4, 5]}
      />
      {/* Orbiting sparkle light */}
      <pointLight
        ref={sparkleRef}
        intensity={1.0}
        color={0xffffff}
        distance={12}
        position={[2, 3, 2]}
      />
      {/* Secondary fire light */}
      <pointLight
        ref={fireRef}
        intensity={0.4}
        color={0xccddff}
        distance={8}
        position={[-2, 4, -1]}
      />
    </>
  );
}

/* ──────────── RING SCENE ──────────── */
function RingScene() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.position.y =
        -0.2 + Math.sin(clock.getElapsedTime() * 0.7) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      <RingBand />
      <Gallery />
      <Prongs />
      <Diamond />
      <SparkleParticles />
      <Lights />
    </group>
  );
}

/* ──────────── ERROR BOUNDARY ──────────── */
interface ErrorBoundaryProps {
  children: ReactNode;
}
interface ErrorBoundaryState {
  hasError: boolean;
}

class WebGLErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

/* ──────────── MAIN EXPORT ──────────── */
export default function HeroRing() {
  const [failed, setFailed] = useState(false);

  if (failed) return null;

  return (
    <WebGLErrorBoundary>
      <Canvas
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.4,
        }}
        camera={{
          position: [0, 2.5, 5.5],
          fov: 30,
          near: 0.1,
          far: 100,
        }}
        style={{ width: "100%", height: "100%" }}
        onCreated={({ gl, scene }) => {
          if (!gl) {
            setFailed(true);
            return;
          }
          gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
          // Set up environment
          const pmremGenerator = new THREE.PMREMGenerator(gl);
          pmremGenerator.compileEquirectangularShader();
          scene.environment = pmremGenerator.fromScene(
            new RoomEnvironment() as unknown as THREE.Scene
          ).texture;
          pmremGenerator.dispose();
        }}
      >
        <RingScene />
        <OrbitControls
          autoRotate
          autoRotateSpeed={0.8}
          enableZoom={false}
          enablePan={false}
          enableDamping
          dampingFactor={0.04}
          target={[0, 0.2, 0]}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2.2}
        />
      </Canvas>
    </WebGLErrorBoundary>
  );
}
