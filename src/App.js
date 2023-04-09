import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import ShaderWaveMaterial from './ShaderMaterial';

function ShockwavePlane() {
  const planeMesh = useRef(null);

  useFrame((state) => {
    const { clock } = state;
    planeMesh.current.material.uniforms.uTime.value = clock.getElapsedTime();
  });

  return <>
    <mesh ref={planeMesh} position={ [0,0,0] } rotation-x={ - Math.PI * 0.5 } >
      <planeGeometry args={[5, 5, 5, 5]} />
      <ShaderWaveMaterial/>
    </mesh>
  </>
}

export default function App() {
  return (
    <Canvas
      camera={{
        fov: 45,
        near: 0.1,
        far: 20,
        position: [ 5, 5, 0 ]
      }}
    >
      <ambientLight intensity={0.5} />
      <ShockwavePlane/>
      <OrbitControls />
    </Canvas>
  )
}
