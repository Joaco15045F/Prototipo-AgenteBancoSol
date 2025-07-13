import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Componente que carga y controla el modelo GLB
const AvatarModel = forwardRef(({ talking }, ref) => {
  const group = useRef();
  const { scene, animations } = useGLTF('/Talking.glb');
  const mixer = useRef();
  const action = useRef();

  // Exponer método para hablar
  useImperativeHandle(ref, () => ({
    talk: () => {
      if (action.current) {
        action.current.reset().play();
      }
    }
  }));

  useEffect(() => {
    if (animations && animations.length > 0) {
      mixer.current = new THREE.AnimationMixer(scene);
      action.current = mixer.current.clipAction(animations[0]);
      if (talking) {
        action.current.reset().play();
      } else {
        action.current.stop();
      }
    }
    // Limpiar mixer al desmontar
    return () => {
      if (mixer.current) mixer.current.stopAllAction();
    };
  }, [scene, animations, talking]);

  useFrame((state, delta) => {
    if (mixer.current) mixer.current.update(delta);
  });

  return <primitive ref={group} object={scene} position={[0, -1.2, 0]} />;
});

// Componente principal para mostrar el Canvas
const Avatar3D = forwardRef((props, ref) => {
  const [talking, setTalking] = React.useState(false);
  const modelRef = useRef();

  // Exponer método para hablar
  useImperativeHandle(ref, () => ({
    talk: () => {
      setTalking(true);
      if (modelRef.current && modelRef.current.talk) {
        modelRef.current.talk();
      }
      setTimeout(() => setTalking(false), 2500); // Duración de la animación
    }
  }));

  return (
    <div style={{ width: '100%', height: 400 }}>
      <Canvas camera={{ position: [0, 1.2, 2.5], fov: 40 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[2, 5, 2]} intensity={0.7} />
        <AvatarModel ref={modelRef} talking={talking} />
        <OrbitControls enablePan={false} enableZoom={false} minPolarAngle={Math.PI/3} maxPolarAngle={Math.PI/2} />
      </Canvas>
    </div>
  );
});

export default Avatar3D; 