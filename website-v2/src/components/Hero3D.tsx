import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sparkles, ContactShadows } from '@react-three/drei';

const AbstractBlob = () => {
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
      <mesh scale={1.6}>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshDistortMaterial 
          color="#b02440" 
          emissive="#b02440" 
          emissiveIntensity={0.2}
          transparent
          opacity={0.3}
          distort={0.5} 
          speed={2} 
          roughness={0.1} 
          metalness={0.1}
          wireframe={true}
        />
      </mesh>
    </Float>
  );
};

export const Hero3D: React.FC = () => {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}>
      <Canvas camera={{ position: [0, 0, 7], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={2} color="#b02440" />
        <directionalLight position={[-10, -10, -5]} intensity={1} color="#ffffff" />
        
        <AbstractBlob />
        
        {/* Floating particles around the blob */}
        <Sparkles 
          count={100} 
          scale={8} 
          size={3} 
          speed={0.4} 
          opacity={0.2} 
          color="#b02440" 
        />
        
        <ContactShadows 
          position={[0, -3, 0]} 
          opacity={0.4} 
          scale={10} 
          blur={2} 
          far={4} 
          color="#b02440"
        />
      </Canvas>
    </div>
  );
};
