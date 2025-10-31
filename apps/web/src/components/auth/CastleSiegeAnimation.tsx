/**
 * Castle Siege Animation
 * 
 * Epic animation depicting a castle under siege from different forces
 * Multiple armies battle with projectiles, explosions, and dynamic effects
 * Culminates in a victorious flag raising with VulHub LeaderBoard title
 */

import React, { useState, useEffect } from 'react';
import { AnimationPhase } from '../../lib/auth/animation-types';

interface CastleSiegeAnimationProps {
  phase: AnimationPhase;
  onComplete?: () => void;
}

interface Projectile {
  id: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  color: string;
  progress: number;
  rotation: number; // Add rotation for spinning projectiles
  trail: boolean; // Add trail effect
}

interface Explosion {
  id: string;
  x: number;
  y: number;
  color: string;
  scale: number;
  rotation: number; // Add rotation for variety
}

interface Debris {
  id: string;
  x: number;
  y: number;
  vx: number; // Velocity X
  vy: number; // Velocity Y
  color: string;
  life: number; // 0-1
}

interface Army {
  color: string;
  position: 'left' | 'right' | 'bottom';
  units: number;
}

const CastleSiegeAnimation: React.FC<CastleSiegeAnimationProps> = ({ phase, onComplete }) => {
  const [step, setStep] = useState(0);
  const [projectiles, setProjectiles] = useState<Projectile[]>([]);
  const [explosions, setExplosions] = useState<Explosion[]>([]);
  const [debris, setDebris] = useState<Debris[]>([]);
  const [castleHealth, setCastleHealth] = useState(100);
  const [flagRaising, setFlagRaising] = useState(false);
  const [flagHeight, setFlagHeight] = useState(0);
  const [flagWave, setFlagWave] = useState(0);
  const [screenShake, setScreenShake] = useState(0);

  // Define the armies (different colored forces)
  const armies: Army[] = [
    { color: '#ef4444', position: 'left', units: 15 },     // Red force (left)
    { color: '#3b82f6', position: 'right', units: 15 },    // Blue force (right)
    { color: '#f59e0b', position: 'bottom', units: 10 },   // Orange force (bottom)
  ];

  // Winner (Green - VulHub/CSUSB color)
  const victorColor = '#00ff00';

  useEffect(() => {
    if (phase !== 'intro') return;

    const stepTimings = [
      1000,  // Step 0: Castle appears
      2000,  // Step 1: Armies assemble
      5000,  // Step 2: Battle begins (projectiles flying)
      3000,  // Step 3: Intense battle
      2000,  // Step 4: Victor emerges
      2000,  // Step 5: Flag raising
      1500,  // Step 6: Title reveal
    ];

    const timer = setTimeout(() => {
      if (step < stepTimings.length - 1) {
        setStep(prev => prev + 1);
      } else if (onComplete) {
        onComplete();
      }
    }, stepTimings[step]);

    return () => clearTimeout(timer);
  }, [phase, step, onComplete]);

  // Generate projectiles during battle
  useEffect(() => {
    if (step < 2 || step > 3) return;

    const interval = setInterval(() => {
      const army = armies[Math.floor(Math.random() * armies.length)];
      let startX, startY, targetX, targetY;

      // Determine projectile path based on army position
      switch (army.position) {
        case 'left':
          startX = 10 + Math.random() * 20;
          startY = 60 + Math.random() * 20;
          targetX = 48 + Math.random() * 4;
          targetY = 40 + Math.random() * 20;
          break;
        case 'right':
          startX = 70 + Math.random() * 20;
          startY = 60 + Math.random() * 20;
          targetX = 48 + Math.random() * 4;
          targetY = 40 + Math.random() * 20;
          break;
        case 'bottom':
          startX = 40 + Math.random() * 20;
          startY = 85 + Math.random() * 10;
          targetX = 48 + Math.random() * 4;
          targetY = 40 + Math.random() * 20;
          break;
        default:
          startX = 50;
          startY = 50;
          targetX = 50;
          targetY = 50;
      }

      const newProjectile: Projectile = {
        id: `proj-${Date.now()}-${Math.random()}`,
        x: startX,
        y: startY,
        targetX,
        targetY,
        color: army.color,
        progress: 0,
        rotation: Math.random() * 360,
        trail: Math.random() > 0.5
      };

      setProjectiles(prev => [...prev, newProjectile]);

      // Animate projectile
      const animateProjectile = setInterval(() => {
        setProjectiles(prev => prev.map(p => {
          if (p.id === newProjectile.id) {
            if (p.progress >= 1) {
              // Create explosion with rotation
              setExplosions(exp => [...exp, {
                id: `exp-${Date.now()}-${Math.random()}`,
                x: p.targetX,
                y: p.targetY,
                color: p.color,
                scale: 0,
                rotation: Math.random() * 360
              }]);
              
              // Create debris particles
              for (let i = 0; i < 5; i++) {
                const angle = (Math.random() * Math.PI * 2);
                const speed = 2 + Math.random() * 3;
                setDebris(d => [...d, {
                  id: `debris-${Date.now()}-${i}`,
                  x: p.targetX,
                  y: p.targetY,
                  vx: Math.cos(angle) * speed,
                  vy: Math.sin(angle) * speed,
                  color: p.color,
                  life: 1
                }]);
              }
              
              // Reduce castle health and screen shake
              setCastleHealth(h => Math.max(0, h - 2));
              setScreenShake(3);
              
              return null as any;
            }
            return { ...p, progress: p.progress + 0.05, rotation: p.rotation + 15 };
          }
          return p;
        }).filter(Boolean));
      }, 50);

      setTimeout(() => clearInterval(animateProjectile), 2000);
    }, step === 3 ? 150 : 300); // More frequent in step 3

    return () => clearInterval(interval);
  }, [step]);

  // Animate explosions
  useEffect(() => {
    explosions.forEach(exp => {
      const timer = setTimeout(() => {
        setExplosions(prev => prev.map(e => 
          e.id === exp.id ? { ...e, scale: e.scale + 0.2 } : e
        ));
      }, 50);

      const removeTimer = setTimeout(() => {
        setExplosions(prev => prev.filter(e => e.id !== exp.id));
      }, 500);

      return () => {
        clearTimeout(timer);
        clearTimeout(removeTimer);
      };
    });
  }, [explosions]);

  // Animate debris particles
  useEffect(() => {
    if (debris.length === 0) return;

    const interval = setInterval(() => {
      setDebris(prev => prev.map(d => ({
        ...d,
        x: d.x + d.vx,
        y: d.y + d.vy,
        vy: d.vy + 0.5, // Gravity
        life: d.life - 0.05
      })).filter(d => d.life > 0));
    }, 50);

    return () => clearInterval(interval);
  }, [debris.length]);

  // Screen shake decay
  useEffect(() => {
    if (screenShake > 0) {
      const timer = setTimeout(() => {
        setScreenShake(prev => Math.max(0, prev - 0.5));
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [screenShake]);

  // Flag wave animation
  useEffect(() => {
    if (flagRaising && flagHeight >= 100) {
      const interval = setInterval(() => {
        setFlagWave(prev => (prev + 1) % 360);
      }, 50);
      return () => clearInterval(interval);
    }
  }, [flagRaising, flagHeight]);

  // Flag raising animation
  useEffect(() => {
    if (step === 5) {
      setFlagRaising(true);
      const interval = setInterval(() => {
        setFlagHeight(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 2;
        });
      }, 30);
      return () => clearInterval(interval);
    }
  }, [step]);

  if (phase !== 'intro') return null;

  // Calculate projectile position
  const getProjectilePosition = (proj: Projectile) => {
    const x = proj.x + (proj.targetX - proj.x) * proj.progress;
    const y = proj.y + (proj.targetY - proj.y) * proj.progress;
    return { x, y };
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black overflow-hidden"
      style={{
        transform: screenShake > 0 
          ? `translate(${(Math.random() - 0.5) * screenShake}px, ${(Math.random() - 0.5) * screenShake}px)`
          : 'none',
        transition: 'transform 0.05s'
      }}
    >
      {/* Starry Sky Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-950 via-purple-950 to-black">
        {/* Stars - Multi-layered with different sizes */}
        {Array.from({ length: 150 }).map((_, i) => {
          const size = Math.random();
          const brightness = Math.random();
          return (
            <div
              key={`star-${i}`}
              className="absolute rounded-full animate-pulse"
              style={{
                width: size > 0.7 ? '3px' : size > 0.4 ? '2px' : '1px',
                height: size > 0.7 ? '3px' : size > 0.4 ? '2px' : '1px',
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 60}%`,
                backgroundColor: brightness > 0.8 ? '#ffffff' : brightness > 0.5 ? '#e0e0ff' : '#b0b0ff',
                opacity: Math.random() * 0.8 + 0.2,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
                boxShadow: size > 0.7 ? '0 0 4px rgba(255,255,255,0.8)' : 'none'
              }}
            />
          );
        })}
      </div>

      {/* Moon with craters */}
      <div 
        className={`absolute top-[10%] right-[15%] w-24 h-24 rounded-full bg-gradient-to-br from-gray-100 to-gray-300 shadow-lg transition-all duration-1000 ${
          step >= 0 ? 'opacity-80 scale-100' : 'opacity-0 scale-0'
        }`}
        style={{
          boxShadow: '0 0 60px rgba(255, 255, 255, 0.5), inset -10px -10px 20px rgba(0,0,0,0.2)'
        }}
      >
        {/* Moon craters */}
        <div className="absolute top-3 left-4 w-4 h-4 rounded-full bg-gray-400 opacity-40" />
        <div className="absolute top-8 left-12 w-6 h-6 rounded-full bg-gray-400 opacity-30" />
        <div className="absolute top-14 left-6 w-3 h-3 rounded-full bg-gray-400 opacity-50" />
        <div className="absolute top-5 right-5 w-5 h-5 rounded-full bg-gray-400 opacity-35" />
      </div>

      {/* Ground */}
      <div className="absolute bottom-0 left-0 right-0 h-[30%] bg-gradient-to-t from-green-900 via-green-800 to-transparent" />

      {/* Castle - Center Stage */}
      <div 
        className={`absolute left-1/2 top-[35%] -translate-x-1/2 transition-all duration-1000 ${
          step >= 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
        }`}
        style={{
          filter: castleHealth < 50 ? 'brightness(0.7) saturate(0.7)' : 'none'
        }}
      >
        {/* Castle Structure */}
        <div className="relative">
          {/* Main Castle Body */}
          <div className="w-32 h-40 bg-gradient-to-b from-gray-600 to-gray-800 rounded-t-lg border-4 border-gray-700">
            {/* Windows */}
            {[0, 1, 2].map(row => (
              <div key={row} className="flex justify-around mt-4">
                {[0, 1].map(col => (
                  <div 
                    key={col} 
                    className="w-4 h-6 bg-yellow-400 rounded-sm"
                    style={{
                      opacity: castleHealth > 30 ? 1 : Math.random() * 0.5,
                      boxShadow: '0 0 10px rgba(255, 200, 0, 0.8)'
                    }}
                  />
                ))}
              </div>
            ))}
          </div>

          {/* Castle Towers */}
          {[-50, 50].map((offset, i) => (
            <div
              key={i}
              className="absolute top-[-20px] w-12 h-24 bg-gradient-to-b from-gray-500 to-gray-700 border-4 border-gray-700"
              style={{ left: offset === -50 ? '-10px' : 'calc(100% - 38px)' }}
            >
              {/* Tower Top */}
              <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 w-16 h-10 bg-red-800 clip-triangle" />
              {/* Tower Window */}
              <div 
                className="absolute top-8 left-1/2 -translate-x-1/2 w-3 h-4 bg-yellow-400 rounded-sm"
                style={{ boxShadow: '0 0 8px rgba(255, 200, 0, 0.8)' }}
              />
            </div>
          ))}

          {/* Flag Pole */}
          <div className="absolute top-[-40px] left-1/2 -translate-x-1/2 w-2 bg-gray-400 transition-all duration-500"
               style={{ height: flagRaising ? '60px' : '40px' }}>
            {/* Flag with wave animation */}
            {flagRaising && (
              <div 
                className="absolute top-0 left-2 w-20 h-14 transition-all duration-1000 origin-left"
                style={{
                  background: `linear-gradient(135deg, ${victorColor} 0%, #00cc00 50%, #00ff00 100%)`,
                  clipPath: 'polygon(0 0, 100% 0, 85% 50%, 100% 100%, 0 100%)',
                  transform: `scaleY(${flagHeight / 100}) ${flagHeight >= 100 ? `skewY(${Math.sin(flagWave * Math.PI / 180) * 3}deg)` : ''}`,
                  boxShadow: `0 0 20px ${victorColor}, 0 0 40px ${victorColor}80`,
                  filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.4))'
                }}
              >
                {/* Flag texture lines */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-2 left-0 right-0 h-px bg-black" />
                  <div className="absolute top-6 left-0 right-0 h-px bg-black" />
                  <div className="absolute top-10 left-0 right-0 h-px bg-black" />
                </div>
                
                {/* CSUSB Text on Flag */}
                {flagHeight > 80 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div 
                      className="font-bold text-xs animate-fade-in px-2 py-1 rounded"
                      style={{
                        color: '#000000',
                        textShadow: '0 0 4px rgba(255,255,255,0.5)',
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(0,0,0,0.3)'
                      }}
                    >
                      CSUSB
                    </div>
                  </div>
                )}
                
                {/* Flag edge highlight */}
                <div 
                  className="absolute top-0 left-0 w-1 h-full bg-white opacity-30"
                  style={{ filter: 'blur(1px)' }}
                />
              </div>
            )}
          </div>

          {/* Castle Gate */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-20 bg-gradient-to-b from-amber-900 to-amber-950 rounded-t-lg border-4 border-amber-950">
            <div className="w-full h-full flex flex-col items-center justify-center">
              {/* Gate Details */}
              <div className="w-1 h-full bg-black opacity-50" />
              <div className="absolute top-2 left-2 right-2 h-1 bg-black opacity-30" />
              <div className="absolute bottom-2 left-2 right-2 h-1 bg-black opacity-30" />
            </div>
          </div>

          {/* Castle Health Bar */}
          {step >= 2 && step <= 4 && (
            <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-40">
              <div className="bg-gray-800 rounded-full h-3 overflow-hidden border-2 border-gray-600">
                <div 
                  className="h-full transition-all duration-300"
                  style={{
                    width: `${castleHealth}%`,
                    background: castleHealth > 50 ? '#22c55e' : castleHealth > 25 ? '#f59e0b' : '#ef4444'
                  }}
                />
              </div>
              <div className="text-center text-white text-xs mt-1 font-mono">
                Castle: {castleHealth}%
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Armies */}
      {step >= 1 && armies.map((army, armyIndex) => {
        const getArmyPosition = () => {
          switch (army.position) {
            case 'left':
              return { bottom: '25%', left: '5%', flexDirection: 'column' as const };
            case 'right':
              return { bottom: '25%', right: '5%', flexDirection: 'column' as const };
            case 'bottom':
              return { bottom: '15%', left: '35%', flexDirection: 'row' as const };
          }
        };

        const position = getArmyPosition();

        return (
          <div
            key={armyIndex}
            className={`absolute flex gap-2 transition-all duration-1000 ${
              step >= 4 && army.color !== victorColor ? 'opacity-20 scale-75' : 'opacity-100 scale-100'
            }`}
            style={position}
          >
            {/* Army Units */}
            {Array.from({ length: army.units }).map((_, unitIndex) => (
              <div
                key={unitIndex}
                className={`w-3 h-3 rounded-sm transition-all duration-300 ${
                  step >= 2 ? 'animate-pulse' : ''
                }`}
                style={{
                  backgroundColor: step >= 4 && castleHealth <= 20 ? victorColor : army.color,
                  boxShadow: `0 0 10px ${army.color}`,
                  animationDelay: `${unitIndex * 100}ms`,
                  transform: step >= 2 ? 'scale(1.1)' : 'scale(1)'
                }}
              />
            ))}
          </div>
        );
      })}

      {/* Projectiles with trails */}
      {projectiles.map(proj => {
        const pos = getProjectilePosition(proj);
        return (
          <React.Fragment key={proj.id}>
            {/* Projectile trail */}
            {proj.trail && (
              <div
                className="absolute rounded-full"
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  width: '12px',
                  height: '12px',
                  background: `radial-gradient(circle, ${proj.color}40, transparent)`,
                  transform: 'translate(-50%, -50%)',
                  opacity: 0.6
                }}
              />
            )}
            {/* Projectile core */}
            <div
              className="absolute w-2 h-2 rounded-full"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                backgroundColor: proj.color,
                boxShadow: `0 0 12px ${proj.color}, 0 0 24px ${proj.color}80`,
                transform: `translate(-50%, -50%) scale(1.5) rotate(${proj.rotation}deg)`,
                transition: 'transform 0.05s linear'
              }}
            >
              {/* Inner glow */}
              <div className="absolute inset-0 rounded-full bg-white opacity-50" style={{ transform: 'scale(0.5)' }} />
            </div>
          </React.Fragment>
        );
      })}

      {/* Explosions - Multi-layered */}
      {explosions.map(exp => (
        <div
          key={exp.id}
          className="absolute"
          style={{
            left: `${exp.x}%`,
            top: `${exp.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          {/* Outer ring */}
          <div
            className="absolute rounded-full transition-all duration-200"
            style={{
              width: `${30 * exp.scale}px`,
              height: `${30 * exp.scale}px`,
              border: `2px solid ${exp.color}`,
              opacity: 0.8 - exp.scale,
              boxShadow: `0 0 ${60 * exp.scale}px ${exp.color}`,
              transform: `translate(-50%, -50%) rotate(${exp.rotation}deg)`
            }}
          />
          {/* Middle burst */}
          <div
            className="absolute rounded-full transition-all duration-200"
            style={{
              width: `${20 * exp.scale}px`,
              height: `${20 * exp.scale}px`,
              backgroundColor: exp.color,
              opacity: 1 - exp.scale,
              boxShadow: `0 0 ${40 * exp.scale}px ${exp.color}`,
              transform: `translate(-50%, -50%) rotate(${-exp.rotation}deg)`
            }}
          />
          {/* Inner core */}
          <div
            className="absolute rounded-full transition-all duration-200"
            style={{
              width: `${10 * exp.scale}px`,
              height: `${10 * exp.scale}px`,
              backgroundColor: '#ffffff',
              opacity: 1 - exp.scale * 2,
              transform: 'translate(-50%, -50%)'
            }}
          />
        </div>
      ))}

      {/* Debris particles */}
      {debris.map(d => (
        <div
          key={d.id}
          className="absolute w-1 h-1 rounded-full"
          style={{
            left: `${d.x}%`,
            top: `${d.y}%`,
            backgroundColor: d.color,
            opacity: d.life * 0.8,
            boxShadow: `0 0 4px ${d.color}`,
            transform: 'translate(-50%, -50%)'
          }}
        />
      ))}

      {/* Victor Declaration */}
      {step >= 4 && (
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 text-center animate-fade-in">
          <div 
            className="text-4xl font-bold mb-2 animate-bounce-subtle"
            style={{
              color: victorColor,
              textShadow: `0 0 20px ${victorColor}, 0 0 40px ${victorColor}`
            }}
          >
            VICTORY
          </div>
        </div>
      )}

      {/* Title Reveal - Enhanced */}
      {step >= 6 && (
        <div className="absolute bottom-[15%] left-1/2 -translate-x-1/2 text-center animate-auth-form-entrance w-full max-w-4xl px-4">
          {/* Decorative border top */}
          <div className="flex items-center justify-center mb-6 animate-fade-in">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-50" />
            <div className="mx-4 w-3 h-3 rotate-45 border-2 border-green-500" style={{ boxShadow: `0 0 10px ${victorColor}` }} />
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-50" />
          </div>
          
          {/* Main title with layered effects */}
          <h1 
            className="text-6xl md:text-7xl font-display font-bold mb-2 animate-pulse-slow relative"
            style={{
              color: victorColor,
              textShadow: `
                0 0 10px ${victorColor},
                0 0 20px ${victorColor},
                0 0 30px ${victorColor},
                0 0 40px ${victorColor}80,
                0 0 70px ${victorColor}40,
                0 4px 8px rgba(0,0,0,0.5)
              `,
              letterSpacing: '0.05em'
            }}
          >
            VulHub LeaderBoard
            {/* Animated underline */}
            <div 
              className="absolute -bottom-2 left-1/2 h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent animate-fade-in"
              style={{
                width: '80%',
                transform: 'translateX(-50%)',
                boxShadow: `0 0 10px ${victorColor}`,
                animationDelay: '300ms'
              }}
            />
          </h1>
          
          {/* Subtitle with enhanced styling */}
          <p 
            className="text-2xl md:text-3xl text-cyan-400 font-mono animate-fade-in mt-6 mb-2" 
            style={{ 
              animationDelay: '500ms',
              textShadow: '0 0 10px rgba(34, 211, 238, 0.5), 0 2px 4px rgba(0,0,0,0.5)'
            }}
          >
            by <span className="text-cyan-300 font-bold">CSUSB</span>
          </p>
          
          {/* Tagline pills with enhanced design */}
          <div className="flex justify-center gap-4 mt-8">
            {['Compete', 'Learn', 'Conquer'].map((word, i) => (
              <div
                key={word}
                className="px-6 py-2 bg-green-500/10 border-2 border-green-500/40 rounded-full text-green-400 text-sm md:text-base font-mono font-bold animate-fade-in relative overflow-hidden group"
                style={{ 
                  animationDelay: `${700 + (i * 200)}ms`,
                  boxShadow: `0 0 15px ${victorColor}30, inset 0 0 10px ${victorColor}10`
                }}
              >
                {/* Animated background shimmer */}
                <div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-green-500/20 to-transparent animate-pulse"
                  style={{ animationDuration: '2s', animationDelay: `${i * 0.3}s` }}
                />
                <span className="relative z-10">{word}</span>
              </div>
            ))}
          </div>
          
          {/* Decorative border bottom */}
          <div className="flex items-center justify-center mt-8 animate-fade-in" style={{ animationDelay: '1s' }}>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-50" />
            <div className="mx-4 w-2 h-2 bg-green-500 rounded-full" style={{ boxShadow: `0 0 10px ${victorColor}` }} />
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-50" />
          </div>
        </div>
      )}

      {/* Battle Sound Effect Indicator (Visual) */}
      {step >= 2 && step <= 3 && (
        <div className="absolute bottom-4 right-4 flex items-center gap-2 animate-pulse">
          <div className="w-2 h-4 bg-red-500 rounded-full" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-6 bg-orange-500 rounded-full" style={{ animationDelay: '100ms' }} />
          <div className="w-2 h-8 bg-yellow-500 rounded-full" style={{ animationDelay: '200ms' }} />
          <div className="w-2 h-6 bg-orange-500 rounded-full" style={{ animationDelay: '300ms' }} />
          <div className="w-2 h-4 bg-red-500 rounded-full" style={{ animationDelay: '400ms' }} />
        </div>
      )}
    </div>
  );
};

export default CastleSiegeAnimation;

