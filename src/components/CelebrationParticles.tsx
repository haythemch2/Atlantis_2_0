import { useCallback, useEffect, useRef, useState } from 'react';
import { Container, Sprite, useTick } from '@pixi/react';
import * as PIXI from 'pixi.js';

interface ParticleProps {
  plotX: number;
  plotY: number;
  plotWidth: number;
  plotHeight: number;
  isMintTransactionConfirmed: boolean;
}

const NUM_PARTICLES = 150;
const PARTICLE_LIFETIME = 3000; // milliseconds
const EMISSION_DURATION = 2000; // milliseconds

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  life: number;
}

const CelebrationParticles: React.FC<ParticleProps> = ({ plotX, plotY, plotWidth, plotHeight, isMintTransactionConfirmed }) => {
  const [isEmitting, setIsEmitting] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const emissionStartTime = useRef(0);
  
  const centerX = plotX + 2 * plotWidth;
  const centerY = plotY + 2 * plotHeight;

  const createParticle = useCallback((): Particle => {
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.5 + Math.random() * 2;
    return {
      x: centerX,
      y: centerY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      alpha: 1,
      life: PARTICLE_LIFETIME,
    };
  }, [centerX, centerY]);

  const triggerEmission = useCallback(() => {
    setIsEmitting(true);
    emissionStartTime.current = Date.now();
    setParticles(Array(NUM_PARTICLES).fill(null).map(createParticle));
  }, [createParticle]);

  useTick((delta) => {
    if (!isEmitting) return;

    const currentTime = Date.now();
    if (currentTime - emissionStartTime.current > EMISSION_DURATION) {
      setIsEmitting(false);
      setParticles([]);
      return;
    }

    setParticles(prevParticles => 
      prevParticles.map(particle => {
        particle.x += particle.vx * delta;
        particle.y += particle.vy * delta;
        particle.life -= 16.67 * delta; // Assuming 60fps
        particle.alpha = particle.life / PARTICLE_LIFETIME;
        return particle;
      }).filter(particle => particle.life > 0)
    );
  });

  useEffect(() => {
    console.log('called');
    
    triggerEmission();
  }, [isMintTransactionConfirmed]);

  return (
    <Container>
      {particles.map((particle, index) => (
        <Sprite
          key={index}
          texture={PIXI.Texture.WHITE}
          x={particle.x}
          y={particle.y}
          anchor={0.5}
          alpha={particle.alpha}
          tint={0xFFD700} // Gold color
          width={4}
          height={4}
        />
      ))}
    </Container>
  );
};

export default CelebrationParticles;