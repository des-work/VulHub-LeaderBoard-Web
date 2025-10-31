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

    // Optimized timing - reduced from 16.5s to 10s total
    const stepTimings = [
      800,   // Step 0: Castle appears (was 1000)
      1200,  // Step 1: Armies assemble (was 2000)
      3000,  // Step 2: Battle begins (was 5000)
      2000,  // Step 3: Intense battle (was 3000)
      1200,  // Step 4: Victor emerges (was 2000)
      1200,  // Step 5: Flag raising (was 2000)
      600,   // Step 6: Title reveal (was 1500)
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
        {Array.from({ length: 200 }).map((_, i) => {
          const size = Math.random();
          const brightness = Math.random();
          const twinkleSpeed = 2 + Math.random() * 4;
          return (
            <div
              key={`star-${i}`}
              className="absolute rounded-full"
              style={{
                width: size > 0.8 ? '4px' : size > 0.5 ? '2.5px' : '1.5px',
                height: size > 0.8 ? '4px' : size > 0.5 ? '2.5px' : '1.5px',
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 65}%`,
                backgroundColor: brightness > 0.85 ? '#ffffff' : brightness > 0.6 ? '#e8e8ff' : '#c0c0ff',
                opacity: Math.random() * 0.9 + 0.15,
                animation: `twinkle ${twinkleSpeed}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 3}s`,
                boxShadow: size > 0.8 ? `0 0 ${3 + Math.random() * 3}px currentColor` : size > 0.5 ? `0 0 2px currentColor` : 'none'
              }}
            />
          );
        })}
        
        {/* Atmospheric glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/30 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Moon with craters - enhanced */}
      <div 
        className={`absolute top-[12%] right-[12%] w-28 h-28 rounded-full transition-all duration-1000 ${
          step >= 0 ? 'opacity-90 scale-100' : 'opacity-0 scale-0'
        }`}
        style={{
          background: 'radial-gradient(circle at 30% 30%, #ffffff, #f0f0f0, #e0e0e0)',
          boxShadow: '0 0 80px rgba(255, 255, 255, 0.4), inset -15px -15px 30px rgba(0,0,0,0.3), inset 5px 5px 15px rgba(255,255,255,0.2)'
        }}
      >
        {/* Moon craters - more detailed */}
        <div className="absolute top-4 left-6 w-5 h-5 rounded-full bg-gray-400 opacity-50 shadow-inner" />
        <div className="absolute top-10 left-16 w-7 h-7 rounded-full bg-gray-500 opacity-40 shadow-inner" />
        <div className="absolute top-16 left-8 w-4 h-4 rounded-full bg-gray-400 opacity-60 shadow-inner" />
        <div className="absolute top-6 right-6 w-6 h-6 rounded-full bg-gray-400 opacity-45 shadow-inner" />
        <div className="absolute bottom-8 left-1/2 w-3 h-3 rounded-full bg-gray-500 opacity-35 shadow-inner" />
      </div>

      {/* Ground with more detail */}
      <div className="absolute bottom-0 left-0 right-0 h-[32%]">
        <div className="absolute inset-0 bg-gradient-to-t from-green-950 via-green-900 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/20 via-transparent to-green-900/20" />
        {/* Ground texture */}
        <div className="absolute bottom-0 left-0 right-0 h-20 opacity-30" style={{
          backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(0,0,0,0.3) 20px, rgba(0,0,0,0.3) 40px)`
        }} />
      </div>

      {/* Castle - Center Stage */}
      <div 
        className={`absolute left-1/2 top-[35%] -translate-x-1/2 transition-all duration-1000 ${
          step >= 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
        }`}
        style={{
          filter: castleHealth < 50 ? 'brightness(0.75) saturate(0.8)' : 'brightness(1.05)',
          textShadow: 'drop-shadow(0 10px 20px rgba(0,0,0,0.5))'
        }}
      >
        {/* Castle Structure */}
        <div className="relative">
          {/* Main Castle Body - Enhanced */}
          <div className="w-36 h-44 bg-gradient-to-b from-gray-500 to-gray-700 rounded-t-xl border-4 border-gray-600 shadow-2xl" style={{ boxShadow: '0 20px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)' }}>
            {/* Windows with enhanced lighting */}
            {[0, 1, 2].map(row => (
              <div key={row} className="flex justify-around mt-5 px-2">
                {[0, 1].map(col => (
                  <div 
                    key={col} 
                    className="w-5 h-7 bg-yellow-300 rounded-sm"
                    style={{
                      opacity: castleHealth > 30 ? (0.8 + Math.random() * 0.2) : (Math.random() * 0.4),
                      boxShadow: `0 0 12px rgba(255, 230, 0, 0.9), inset 0 0 4px rgba(255,200,0,0.5)`,
                      background: castleHealth > 30 ? 'radial-gradient(circle at 30% 30%, #ffff99, #ffeb3b, #ffca28)' : '#999999'
                    }}
                  />
                ))}
              </div>
            ))}
            
            {/* Stone texture lines */}
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 30px, rgba(0,0,0,0.2) 30px, rgba(0,0,0,0.2) 31px)`
            }} />
          </div>

          {/* Castle Towers - Enhanced */}
          {[-50, 50].map((offset, i) => (
            <div
              key={i}
              className="absolute top-[-25px] w-14 h-28 bg-gradient-to-b from-gray-400 to-gray-600 border-4 border-gray-600 rounded-t-lg shadow-xl"
              style={{ 
                left: offset === -50 ? '-12px' : 'calc(100% - 42px)',
                boxShadow: '0 15px 30px rgba(0,0,0,0.5), inset 1px 1px 0 rgba(255,255,255,0.1)'
              }}
            >
              {/* Tower Top - Peaked roof */}
              <div 
                className="absolute top-[-15px] left-1/2 -translate-x-1/2 w-20 h-14"
                style={{
                  background: 'linear-gradient(135deg, #8b4513 0%, #a0522d 50%, #654321 100%)',
                  clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
                  boxShadow: 'inset -5px 5px 10px rgba(0,0,0,0.4)'
                }}
              />
              {/* Tower Window */}
              <div 
                className="absolute top-10 left-1/2 -translate-x-1/2 w-4 h-5 rounded-sm"
                style={{ 
                  background: 'radial-gradient(circle at 40% 40%, #ffff99, #ffeb3b)',
                  boxShadow: '0 0 10px rgba(255, 200, 0, 0.9), inset 0 0 3px rgba(0,0,0,0.2)'
                }}
              />
              {/* Tower detail */}
              <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 25px, rgba(0,0,0,0.3) 25px, rgba(0,0,0,0.3) 26px)`
              }} />
            </div>
          ))}

          {/* Flag Pole - Enhanced */}
          <div className="absolute top-[-50px] left-1/2 -translate-x-1/2 w-3 bg-gradient-to-b from-gray-300 to-gray-500 rounded-full transition-all duration-500 shadow-lg"
               style={{ 
                 height: flagRaising ? '70px' : '45px',
                 boxShadow: '0 5px 15px rgba(0,0,0,0.4), inset 0 1px 2px rgba(255,255,255,0.2)'
               }}>
            {/* Flag with enhanced wave animation */}
            {flagRaising && (
              <div 
                className="absolute top-1 left-3 transition-all duration-1000 origin-left shadow-2xl"
                style={{
                  width: '24px',
                  height: '16px',
                  background: `linear-gradient(135deg, ${victorColor} 0%, #00d900 50%, #00ff00 100%)`,
                  clipPath: 'polygon(0 0, 100% 0, 85% 50%, 100% 100%, 0 100%)',
                  transform: `scaleY(${flagHeight / 100}) ${flagHeight >= 100 ? `skewY(${Math.sin(flagWave * Math.PI / 180) * 4}deg)` : ''}`,
                  boxShadow: `0 0 30px ${victorColor}, 0 0 60px ${victorColor}80, 0 0 90px ${victorColor}40, drop-shadow(3px 5px 10px rgba(0,0,0,0.5))`,
                  filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.6))'
                }}
              >
                {/* Flag texture */}
                <div className="absolute inset-0 opacity-30">
                  <div className="absolute top-2 left-0 right-0 h-px bg-black/40" />
                  <div className="absolute top-5 left-0 right-0 h-px bg-black/30" />
                  <div className="absolute top-8 left-0 right-0 h-px bg-black/25" />
                </div>
                
                {/* CSUSB Text on Flag - Enhanced */}
                {flagHeight > 75 && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0" style={{ animation: `fadeIn 0.5s ease-out forwards` }}>
                    <div 
                      className="font-bold text-xs rounded-sm px-1.5"
                      style={{
                        color: '#000000',
                        textShadow: '0 0 6px rgba(255,255,255,0.8), 0 1px 2px rgba(0,0,0,0.4)',
                        backgroundColor: 'rgba(255,255,255,0.15)',
                        border: '1px solid rgba(0,0,0,0.4)',
                        letterSpacing: '0.5px',
                        fontWeight: 'bold'
                      }}
                    >
                      CSUSB
                    </div>
                  </div>
                )}
                
                {/* Flag edge highlight */}
                <div 
                  className="absolute top-0 left-0 w-0.5 h-full bg-white opacity-40"
                  style={{ filter: 'blur(0.5px)' }}
                />
              </div>
            )}
          </div>

          {/* Castle Gate - Enhanced */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-18 h-24 rounded-t-lg border-4 border-amber-900 shadow-xl" style={{
            background: 'linear-gradient(to bottom, #8b6914 0%, #6d5511 50%, #5a4409 100%)',
            boxShadow: '0 10px 25px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1), inset 0 2px 5px rgba(0,0,0,0.3)'
          }}>
            <div className="w-full h-full flex flex-col items-center justify-center relative">
              {/* Gate door frame */}
              <div className="absolute inset-2 border-2 border-yellow-900/40 rounded-sm" />
              {/* Gate center line */}
              <div className="w-px h-3/4 bg-black opacity-40" />
              {/* Gate details */}
              <div className="absolute top-3 left-3 right-3 h-1 bg-black opacity-20 rounded-full" />
              <div className="absolute bottom-3 left-3 right-3 h-1 bg-black opacity-20 rounded-full" />
              {/* Door studs */}
              {[...Array(3)].map((_, i) => (
                <div key={i} className="absolute w-2 h-2 rounded-full bg-yellow-700/50" style={{
                  left: `${30 + i * 15}%`,
                  top: `${40 + (i % 2) * 20}%`
                }} />
              ))}
            </div>
          </div>

          {/* Castle Health Bar - Enhanced */}
          {step >= 2 && step <= 4 && (
            <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-44">
              <div className="bg-gray-900 rounded-full h-4 overflow-hidden border-2 border-gray-700 shadow-lg" style={{ boxShadow: '0 5px 15px rgba(0,0,0,0.5)' }}>
                <div 
                  className="h-full transition-all duration-300"
                  style={{
                    width: `${castleHealth}%`,
                    background: castleHealth > 50 ? 'linear-gradient(90deg, #22c55e, #86efac)' : castleHealth > 25 ? 'linear-gradient(90deg, #f59e0b, #fbbf24)' : 'linear-gradient(90deg, #ef4444, #fca5a5)',
                    boxShadow: `inset 0 1px 0 rgba(255,255,255,0.2), 0 0 15px ${castleHealth > 50 ? 'rgba(34,197,94,0.4)' : castleHealth > 25 ? 'rgba(245,158,11,0.4)' : 'rgba(239,68,68,0.4)'}`
                  }}
                />
              </div>
              <div className="text-center text-white text-xs mt-2 font-mono font-bold" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                Castle Integrity: {Math.max(0, castleHealth)}%
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

      {/* Projectiles with trails - enhanced */}
      {projectiles.map(proj => {
        const pos = getProjectilePosition(proj);
        return (
          <React.Fragment key={proj.id}>
            {/* Projectile trail - enhanced */}
            {proj.trail && (
              <div
                className="absolute rounded-full blur-sm"
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  width: '16px',
                  height: '16px',
                  background: `radial-gradient(circle, ${proj.color}60, ${proj.color}20, transparent)`,
                  transform: 'translate(-50%, -50%)',
                  opacity: 0.7,
                  boxShadow: `0 0 20px ${proj.color}50`
                }}
              />
            )}
            {/* Projectile core - enhanced */}
            <div
              className="absolute w-3 h-3 rounded-full"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                backgroundColor: proj.color,
                boxShadow: `0 0 15px ${proj.color}, 0 0 30px ${proj.color}99, 0 0 50px ${proj.color}66`,
                transform: `translate(-50%, -50%) scale(1.5) rotate(${proj.rotation}deg)`,
                transition: 'transform 0.05s linear',
                filter: 'drop-shadow(0 0 5px rgba(0,0,0,0.3))'
              }}
            >
              {/* Inner glow - enhanced */}
              <div className="absolute inset-0 rounded-full bg-white opacity-60" style={{ transform: 'scale(0.45)' }} />
              {/* Outer glow layer */}
              <div className="absolute inset-0 rounded-full opacity-40" style={{ 
                transform: 'scale(1.8)',
                background: `radial-gradient(circle, ${proj.color}, transparent)`
              }} />
            </div>
          </React.Fragment>
        );
      })}

      {/* Explosions - Multi-layered enhanced */}
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
          {/* Background glow ring */}
          <div
            className="absolute rounded-full transition-all duration-200 blur-lg"
            style={{
              width: `${50 * exp.scale}px`,
              height: `${50 * exp.scale}px`,
              border: `1px solid ${exp.color}`,
              opacity: (0.6 - exp.scale) * 0.7,
              boxShadow: `0 0 ${100 * exp.scale}px ${exp.color}`,
              transform: `translate(-50%, -50%)`
            }}
          />
          {/* Outer ring */}
          <div
            className="absolute rounded-full transition-all duration-200"
            style={{
              width: `${35 * exp.scale}px`,
              height: `${35 * exp.scale}px`,
              border: `2.5px solid ${exp.color}`,
              opacity: 0.9 - exp.scale,
              boxShadow: `0 0 ${70 * exp.scale}px ${exp.color}, inset 0 0 ${15 * exp.scale}px ${exp.color}40`,
              transform: `translate(-50%, -50%) rotate(${exp.rotation}deg)`
            }}
          />
          {/* Middle burst */}
          <div
            className="absolute rounded-full transition-all duration-200"
            style={{
              width: `${24 * exp.scale}px`,
              height: `${24 * exp.scale}px`,
              backgroundColor: exp.color,
              opacity: 0.95 - exp.scale * 1.1,
              boxShadow: `0 0 ${50 * exp.scale}px ${exp.color}, 0 0 ${25 * exp.scale}px ${exp.color}80`,
              transform: `translate(-50%, -50%) rotate(${-exp.rotation}deg) scale(${0.8 + Math.sin(exp.rotation * Math.PI / 180) * 0.2})`
            }}
          />
          {/* Inner core - bright */}
          <div
            className="absolute rounded-full transition-all duration-200"
            style={{
              width: `${12 * exp.scale}px`,
              height: `${12 * exp.scale}px`,
              backgroundColor: '#ffffff',
              opacity: 1.2 - exp.scale * 1.4,
              boxShadow: `0 0 ${20 * exp.scale}px #ffffff`,
              transform: 'translate(-50%, -50%)',
              filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.8))'
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

      {/* Title Reveal - Enhanced with premium styling */}
      {step >= 6 && (
        <div className="absolute bottom-[15%] left-1/2 -translate-x-1/2 text-center animate-auth-form-entrance w-full max-w-4xl px-4">
          {/* Background glow */}
          <div className="absolute -inset-20 bg-gradient-to-t from-green-500/20 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />
          
          {/* Decorative border top */}
          <div className="flex items-center justify-center mb-8 animate-fade-in">
            <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-60" />
            <div className="mx-6 w-4 h-4 rotate-45 border-2 border-green-500" style={{ boxShadow: `0 0 15px ${victorColor}` }} />
            <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-60" />
          </div>
          
          {/* Main title with ultra-premium effects */}
          <h1 
            className="text-6xl md:text-8xl font-display font-black mb-4 animate-pulse-slow relative tracking-wide"
            style={{
              color: victorColor,
              textShadow: `
                0 0 20px ${victorColor},
                0 0 40px ${victorColor},
                0 0 60px ${victorColor},
                0 0 80px ${victorColor}99,
                0 0 120px ${victorColor}66,
                0 8px 16px rgba(0,0,0,0.6)
              `,
              letterSpacing: '0.08em',
              fontWeight: 900
            }}
          >
            VulHub LeaderBoard
            {/* Animated underline - premium */}
            <div 
              className="absolute -bottom-4 left-1/2 h-1.5 bg-gradient-to-r from-transparent via-green-500 to-transparent animate-fade-in rounded-full"
              style={{
                width: '85%',
                transform: 'translateX(-50%)',
                boxShadow: `0 0 20px ${victorColor}, 0 0 40px ${victorColor}80`,
                animationDelay: '300ms'
              }}
            />
          </h1>
          
          {/* Subtitle with enhanced styling */}
          <p 
            className="text-3xl md:text-4xl text-cyan-300 font-mono animate-fade-in mt-12 mb-3 font-bold" 
            style={{ 
              animationDelay: '500ms',
              textShadow: '0 0 15px rgba(34, 211, 238, 0.7), 0 0 30px rgba(0, 255, 0, 0.2), 0 4px 8px rgba(0,0,0,0.5)',
              letterSpacing: '0.05em'
            }}
          >
            by <span className="text-cyan-200 font-black" style={{ textShadow: '0 0 20px rgba(34, 211, 238, 0.8)' }}>CSUSB</span>
          </p>
          
          {/* Tagline pills with enhanced design */}
          <div className="flex justify-center gap-5 mt-10 flex-wrap">
            {['Compete', 'Learn', 'Conquer'].map((word, i) => (
              <div
                key={word}
                className="px-8 py-3 bg-gradient-to-r from-green-500/15 to-cyan-500/15 hover:from-green-500/25 hover:to-cyan-500/25 border-2 border-green-500/50 rounded-full text-green-300 text-base md:text-lg font-mono font-bold animate-fade-in relative overflow-hidden group transition-all duration-300"
                style={{ 
                  animationDelay: `${700 + (i * 200)}ms`,
                  boxShadow: `0 0 20px ${victorColor}30, inset 0 0 15px ${victorColor}10, 0 5px 15px rgba(0,0,0,0.3)`
                }}
              >
                {/* Animated background shimmer */}
                <div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-green-500/30 to-transparent animate-pulse"
                  style={{ animationDuration: '2.5s', animationDelay: `${i * 0.3}s` }}
                />
                <span className="relative z-10 flex items-center gap-2">
                  {i === 0 && '⚔️'}
                  {i === 1 && '📚'}
                  {i === 2 && '🏆'}
                  {word}
                </span>
              </div>
            ))}
          </div>
          
          {/* Decorative border bottom */}
          <div className="flex items-center justify-center mt-12 animate-fade-in" style={{ animationDelay: '1s' }}>
            <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-60" />
            <div className="mx-6 w-3 h-3 bg-green-500 rounded-full animate-pulse" style={{ boxShadow: `0 0 15px ${victorColor}` }} />
            <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-60" />
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

