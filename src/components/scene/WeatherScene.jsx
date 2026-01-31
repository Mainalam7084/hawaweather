import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';
import { useReducedMotion } from '../../hooks/useReducedMotion';

function RainParticles({ count = 200, isFrozen }) {
  const mesh = useRef();

  const particles = useMemo(() => {
    return Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 20,
      y: (Math.random() - 0.5) * 20,
      z: (Math.random() - 0.5) * 10 - 2,
      speed: 0.1 + Math.random() * 0.2
    }));
  }, [count]);

  useFrame(() => {
    if (!mesh.current || isFrozen) return;
    mesh.current.children.forEach((child, i) => {
      child.position.y -= particles[i].speed;
      if (child.position.y < -10) {
        child.position.y = 10;
      }
    });
  });

  return (
    <group ref={mesh}>
      {particles.map((p, i) => (
        <mesh key={i} position={[p.x, p.y, p.z]}>
          <boxGeometry args={[0.03, 0.4, 0.03]} />
          <meshStandardMaterial color="#60a5fa" emissive="#3b82f6" emissiveIntensity={0.5} transparent opacity={0.8} />
        </mesh>
      ))}
    </group>
  );
}

function WindLine({ startPos, speed, color, isFrozen, width = 3, opacity = 0.5 }) {
  const lineRef = useRef();

  const curve = useMemo(() => {
    const points = [];
    const segments = 40; // High resolution for smoothness
    const xStart = -25;
    const xEnd = 25;
    const range = xEnd - xStart;

    // Create a long, gentle sine wave
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const x = xStart + t * range;

      // Gentle, large simple sine wave. 
      // Varies by startPos for uniqueness
      const freq = 1.5; // low frequency
      const amp = 1.5; // gentle amplitude
      const y = Math.sin((t * Math.PI * 2 * freq) + startPos[1]) * amp;

      points.push(new THREE.Vector3(x, y, 0));
    }
    return new THREE.CatmullRomCurve3(points);
  }, [startPos]);

  useFrame((state, delta) => {
    if (isFrozen || !lineRef.current || !lineRef.current.material) return;

    // Animate flow along the line
    lineRef.current.material.dashOffset -= delta * speed * 0.5;
  });

  return (
    <group position={startPos}>
      <Line
        ref={lineRef}
        points={curve.getPoints(100)}
        color={color}
        lineWidth={width}
        transparent
        opacity={opacity}
        dashed={true}
        dashArray={10} // Long flowing segments
        dashRatio={0.5} // Balanced line/gap
        toneMapped={false} // Better color brightness
      />
    </group>
  );
}

function WindLines({ count = 6, color, isFrozen, opacity }) {
  const lines = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      pos: [
        0, // Center X 
        (i - count / 2) * 2 + (Math.random() - 0.5) * 2, // Distributed Y
        (Math.random() - 0.5) * 4 // moderate Z depth for parallax
      ],
      speed: 0.2 + Math.random() * 0.3, // Slow movement
      width: 2 + Math.random() * 2 // Varying thickness
    }));
  }, [count]);

  return (
    <>
      {lines.map((line, i) => (
        <WindLine
          key={i}
          startPos={line.pos}
          speed={line.speed}
          color={color}
          isFrozen={isFrozen}
          width={line.width}
          opacity={opacity}
        />
      ))}
    </>
  );
}

export function WeatherScene({ weatherCode, isDay, theme }) {
  const prefersReducedMotion = useReducedMotion();

  // Determine weather type
  const isSevere = weatherCode >= 50;

  // Colors & Opacity
  let bgColor, lineColor, lineOpacity;

  if (isSevere) {
    // Rainy/Stormy
    bgColor = theme === 'dark' ? '#0f172a' : '#94a3b8';
    lineColor = '#cbd5e1';
    lineOpacity = 0.4;
  } else if (weatherCode > 2) {
    // Cloudy
    bgColor = theme === 'dark' ? '#1e293b' : '#e2e8f0';
    lineColor = theme === 'dark' ? '#94a3b8' : '#64748b';
    lineOpacity = 0.5;
  } else {
    // Clear (Default)
    bgColor = theme === 'dark' ? '#020617' : '#f8fafc';
    // Dark mode: Sky blue for visibility. Light mode: Slate 400.
    lineColor = theme === 'dark' ? '#7dd3fc' : '#94a3b8';
    lineOpacity = theme === 'dark' ? 0.4 : 0.6;
  }

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none transition-colors duration-1000" style={{ backgroundColor: bgColor }}>
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
        <ambientLight intensity={0.6} />

        {isSevere ? (
          <RainParticles count={250} isFrozen={prefersReducedMotion} />
        ) : (
          <WindLines
            count={20}
            color={lineColor}
            opacity={lineOpacity}
            isFrozen={prefersReducedMotion}
          />
        )}
      </Canvas>
    </div>
  );
}
