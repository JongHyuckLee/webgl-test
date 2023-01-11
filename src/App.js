import "./styles.css";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, useFBX } from "@react-three/drei";
import { Suspense, useMemo, useState } from "react";
import { useSpring, animated, config } from "@react-spring/three";
import * as THREE from "three";

const Scene = () => {
  const fbx = useFBX("Strawberry_fbx.fbx");
  console.log({ fbx });
  const model = useMemo(() => fbx.clone(true), []);
  return <primitive object={fbx} scale={0.005} />;
};

function FillLight({ brightness, color }) {
  return (
    <rectAreaLight
      width={3}
      height={3}
      intensity={brightness}
      color={color}
      position={[2, 1, 4]}
      lookAt={[0, 0, 0]}
      penumbra={2}
      castShadow
    />
  );
}
function GroundPlane() {
  return (
    <mesh receiveShadow rotation={[5, 0, 0]} position={[0, -1, 0]}>
      <planeBufferGeometry attach="geometry" args={[500, 500]} />
      <meshStandardMaterial attach="material" color="white" />
    </mesh>
  );
}
function BackDrop() {
  return (
    <mesh receiveShadow position={[0, -1, -5]}>
      <planeBufferGeometry attach="geometry" args={[500, 500]} />
      <meshStandardMaterial attach="material" color="white" />
    </mesh>
  );
}
function RimLight({ brightness, color }) {
  return (
    <rectAreaLight
      width={2}
      height={2}
      intensity={brightness}
      color={color}
      position={[1, 4, -2]}
      rotation={[0, 180, 0]}
      castShadow
    />
  );
}

// Lights
function KeyLight({ brightness, color }) {
  return (
    <rectAreaLight
      width={3}
      height={3}
      color={color}
      intensity={brightness}
      position={[-2, 0, 5]}
      lookAt={[0, 0, 0]}
      penumbra={1}
      castShadow
    />
  );
}
const Scene2 = () => {
  const fbx = useFBX("Poimandres.fbx");
  console.log({ fbx });
  const model = useMemo(() => fbx.clone(true), []);
  return (
    <Canvas
      className="canvas"
      shadowmap="true"
      camera={{ position: [0, 0, 8], fov: 50 }}
      gl={{ antialias: false }}
      onCreated={({ gl }) => {
        gl.outputEncoding = THREE.sRGBEncoding;
      }}
    >
      <GroundPlane />
      <BackDrop />

      <FillLight brightness={2.6} color={"#bdefff"} />
      <RimLight brightness={54} color={"#fff"} />

      <primitive object={fbx} scale={0.005} />
      <OrbitControls />
    </Canvas>
  );
};

export default function App() {
  const [active, setActive] = useState(false);
  const { scale } = useSpring({ scale: active ? 1.5 : 1 });
  return (
    <div className="App">
      <Canvas>
        <pointLight position={[10, 10, 10]} />
        <OrbitControls />
        <animated.mesh
          scale={scale}
          onClick={() => setActive(!active)}
          position={[1, 2, 3]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <sphereGeometry args={[1, 6, 6]} />
          <meshStandardMaterial color="hotpink" />
        </animated.mesh>
      </Canvas>
      <Canvas>
        <spotLight position={[100, 10, 0]} angle={0.5} />
        <ambientLight intensity={0.3} />
        <OrbitControls />
        <mesh>
          <sphereGeometry />
          <meshStandardMaterial color="hotpink" />
        </mesh>
      </Canvas>
      <Canvas>
        <Suspense fallback={null}>
          <pointLight position={[10, 10, 10]} />
          <ambientLight intensity={0.3} />
          <spotLight position={[200, 30, 0]} angle={0.5} />
          <Scene />
          <OrbitControls />
        </Suspense>
      </Canvas>

      <Suspense fallback={null}>
        <Scene2 />
      </Suspense>
    </div>
  );
}
