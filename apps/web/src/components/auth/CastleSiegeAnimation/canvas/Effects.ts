/**
 * Rendering Effects
 * 
 * Helper functions for drawing complex visual effects (castle, flag, title, etc.)
 */

import { Castle, Tower, Gate, FlagPole } from '../types';
import { COLORS, CASTLE_CONFIG, TITLE_CONFIG } from '../config';

/**
 * Draw a starry sky background with gradient
 */
export function drawSky(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  // Sky gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, COLORS.skyTop);
  gradient.addColorStop(0.5, COLORS.skyMid);
  gradient.addColorStop(1, COLORS.skyBottom);
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

/**
 * Draw a castle tower
 */
export function drawTower(ctx: CanvasRenderingContext2D, tower: Tower, canvasWidth: number, canvasHeight: number): void {
  const x = tower.position.x * canvasWidth;
  const y = tower.position.y * canvasHeight;
  const w = tower.width * canvasWidth;
  const h = tower.height * canvasHeight;
  
  ctx.save();
  
  // Tower body (triangle)
  ctx.fillStyle = COLORS.castleBrown;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + w / 2, y + h);
  ctx.lineTo(x - w / 2, y + h);
  ctx.closePath();
  ctx.fill();
  
  // Tower shadow
  ctx.fillStyle = COLORS.castleBrownDark;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + w / 2, y + h);
  ctx.lineTo(x + w / 4, y + h);
  ctx.lineTo(x, y);
  ctx.closePath();
  ctx.fill();
  
  // Tower window (glowing)
  if (tower.hasWindow) {
    const windowSize = CASTLE_CONFIG.towers.windowSize;
    const windowW = windowSize.width * canvasWidth;
    const windowH = windowSize.height * canvasHeight;
    
    ctx.fillStyle = COLORS.castleYellowGlow;
    ctx.shadowBlur = 15;
    ctx.shadowColor = COLORS.castleYellow;
    ctx.fillRect(x - windowW / 2, y + h * 0.3, windowW, windowH);
    ctx.shadowBlur = 0;
  }
  
  ctx.restore();
}

/**
 * Draw castle gate
 */
export function drawGate(ctx: CanvasRenderingContext2D, gate: Gate, canvasWidth: number, canvasHeight: number): void {
  const x = gate.position.x * canvasWidth;
  const y = gate.position.y * canvasHeight;
  const w = gate.width * canvasWidth;
  const h = gate.height * canvasHeight;
  const borderW = CASTLE_CONFIG.gate.borderWidth * canvasWidth;
  
  ctx.save();
  
  // Gate background
  ctx.fillStyle = COLORS.castleGate;
  ctx.fillRect(x - w / 2, y, w, h);
  
  // Gate border
  ctx.strokeStyle = COLORS.castleAmber;
  ctx.lineWidth = borderW;
  ctx.strokeRect(x - w / 2, y, w, h);
  
  // Gate details
  ctx.fillStyle = COLORS.castleGateDark;
  ctx.fillRect(x - w / 2 + borderW, y + borderW, w - borderW * 2, h - borderW * 2);
  
  // Center line
  ctx.strokeStyle = COLORS.bgBlack;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x, y + borderW);
  ctx.lineTo(x, y + h - borderW);
  ctx.stroke();
  
  // Door studs
  const studSize = w * 0.08;
  const positions = [
    { x: x - w * 0.2, y: y + h * 0.3 },
    { x: x - w * 0.2, y: y + h * 0.6 },
    { x: x + w * 0.2, y: y + h * 0.45 },
  ];
  
  positions.forEach(pos => {
    ctx.fillStyle = COLORS.castleGateDarker;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, studSize / 2, 0, Math.PI * 2);
    ctx.fill();
  });
  
  ctx.restore();
}

/**
 * Draw flag pole and flag
 */
export function drawFlagPole(ctx: CanvasRenderingContext2D, flagPole: FlagPole, canvasWidth: number, canvasHeight: number): void {
  const x = flagPole.position.x * canvasWidth;
  const y = flagPole.position.y * canvasHeight;
  const poleW = CASTLE_CONFIG.flagPole.width * canvasWidth;
  const poleH = CASTLE_CONFIG.flagPole.heightMin + 
                (CASTLE_CONFIG.flagPole.heightMax - CASTLE_CONFIG.flagPole.heightMin) * (flagPole.flagHeight / 100);
  const poleHpx = poleH * canvasHeight;
  
  ctx.save();
  
  // Flag pole (gradient)
  const poleGradient = ctx.createLinearGradient(x - poleW / 2, y, x + poleW / 2, y + poleHpx);
  poleGradient.addColorStop(0, '#d1d5db'); // gray-300
  poleGradient.addColorStop(1, '#6b7280'); // gray-500
  
  ctx.fillStyle = poleGradient;
  ctx.fillRect(x - poleW / 2, y, poleW, poleHpx);
  
  // Flag (if raised)
  if (flagPole.flagHeight > 0) {
    const flagW = CASTLE_CONFIG.flagPole.flagWidth * canvasWidth;
    const flagH = CASTLE_CONFIG.flagPole.flagHeight * canvasHeight * (flagPole.flagHeight / 100);
    
    ctx.translate(x + poleW / 2, y);
    
    // Wave animation
    const waveOffset = Math.sin((flagPole.flagWave * Math.PI) / 180) * 4;
    ctx.rotate(waveOffset * 0.01);
    
    // Flag shape (polygon)
    ctx.fillStyle = COLORS.victorGreen;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(flagW, 0);
    ctx.lineTo(flagW * 0.85, flagH / 2);
    ctx.lineTo(flagW, flagH);
    ctx.lineTo(0, flagH);
    ctx.closePath();
    ctx.fill();
    
    // Flag glow
    ctx.shadowBlur = 30;
    ctx.shadowColor = COLORS.victorGreen;
    ctx.fill();
    ctx.shadowBlur = 0;
    
    // CSUSB text on flag
    if (flagPole.flagHeight > 75) {
      ctx.fillStyle = COLORS.bgBlack;
      ctx.font = `bold ${flagH * 0.3}px monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('CSUSB', flagW / 2, flagH / 2);
    }
  }
  
  ctx.restore();
}

/**
 * Draw health bar
 */
export function drawHealthBar(ctx: CanvasRenderingContext2D, health: number, maxHealth: number, x: number, y: number, width: number, height: number): void {
  const percentage = health / maxHealth;
  
  ctx.save();
  
  // Background
  ctx.fillStyle = COLORS.bgDark;
  ctx.fillRect(x, y, width, height);
  
  // Health fill (color based on health)
  let healthColor = COLORS.healthHigh;
  if (percentage < 0.5) {healthColor = COLORS.healthMid;}
  if (percentage < 0.25) {healthColor = COLORS.healthLow;}
  
  ctx.fillStyle = healthColor;
  ctx.fillRect(x, y, width * percentage, height);
  
  // Border
  ctx.strokeStyle = COLORS.victorGreen;
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, width, height);
  
  // Text
  ctx.fillStyle = COLORS.starWhite;
  ctx.font = `${height * 0.8}px monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`${Math.ceil(health)}%`, x + width / 2, y + height / 2);
  
  ctx.restore();
}

/**
 * Draw title text with glow effects
 */
export function drawTitle(ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number, opacity: number = 1): void {
  const x = TITLE_CONFIG.position.x * canvasWidth;
  const y = TITLE_CONFIG.position.y * canvasHeight;
  
  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Main title
  const mainFontSize = TITLE_CONFIG.fontSize.main * canvasHeight;
  ctx.font = `bold ${mainFontSize}px monospace`;
  ctx.fillStyle = COLORS.titleGreen;
  
  // Multiple text shadows for glow
  ctx.shadowBlur = 20;
  ctx.shadowColor = COLORS.titleGreen;
  ctx.fillText(TITLE_CONFIG.text, x, y);
  
  // Additional shadows
  for (let i = 0; i < 5; i++) {
    ctx.shadowBlur = 20 + i * 10;
    ctx.shadowColor = `${COLORS.titleGreen}${Math.floor(255 * (1 - i * 0.2)).toString(16).padStart(2, '0')}`;
    ctx.fillText(TITLE_CONFIG.text, x, y);
  }
  
  ctx.shadowBlur = 0;
  
  // Subtitle
  const subY = y + mainFontSize * 0.6;
  const subFontSize = TITLE_CONFIG.fontSize.subtitle * canvasHeight;
  ctx.font = `bold ${subFontSize}px monospace`;
  ctx.fillStyle = COLORS.subtitleCyan;
  ctx.shadowBlur = 15;
  ctx.shadowColor = COLORS.titleCyan;
  ctx.fillText(TITLE_CONFIG.subtitle, x, subY);
  
  ctx.restore();
}

