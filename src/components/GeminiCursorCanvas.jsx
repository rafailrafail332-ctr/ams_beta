import React, { useEffect, useRef } from 'react';

export const GeminiCursorCanvas = ({ theme = 'dark' }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse coordinates with smooth lerping
    const mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
      isMoving: false,
      lastMoveTime: Date.now()
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };

    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.isMoving = true;
      mouse.lastMoveTime = Date.now();
    };

    const handleTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        mouse.targetX = e.touches[0].clientX;
        mouse.targetY = e.touches[0].clientY;
        mouse.isMoving = true;
        mouse.lastMoveTime = Date.now();
      }
    };

    // Click sparks array
    let sparks = [];
    const handleClick = (e) => {
      const clickX = e.clientX;
      const clickY = e.clientY;
      for (let i = 0; i < 16; i++) {
        const angle = (Math.PI * 2 * i) / 16 + (Math.random() - 0.5) * 0.5;
        const speed = Math.random() * 2.8 + 1.2;
        sparks.push({
          x: clickX,
          y: clickY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 2.5 + 1.5,
          alpha: 1,
          color: i % 3 === 0 ? '#38bdf8' : (i % 3 === 1 ? '#a855f7' : '#f59e0b')
        });
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('click', handleClick);

    // Particles system (Constellation / Stars)
    let particles = [];
    const PARTICLE_COUNT = Math.min(Math.floor((width * height) / 14000), 75);

    const initParticles = () => {
      particles = [];
      const colors = ['#38bdf8', '#818cf8', '#c084fc', '#f59e0b', '#34d399', '#ffffff'];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: Math.random() * 1.8 + 0.6,
          baseAlpha: Math.random() * 0.45 + 0.25,
          color: colors[Math.floor(Math.random() * colors.length)],
          twinkleSpeed: Math.random() * 0.02 + 0.008,
          phase: Math.random() * Math.PI * 2
        });
      }
    };

    initParticles();

    // Ambient floating glow orbs (Gemini aurora wave)
    let time = 0;

    const render = () => {
      time += 0.012;
      ctx.clearRect(0, 0, width, height);

      // Smooth lerp mouse coordinates
      mouse.x += (mouse.targetX - mouse.x) * 0.085;
      mouse.y += (mouse.targetY - mouse.y) * 0.085;

      const isDark = theme === 'dark';

      // 1. Ambient Gemini Aurora Waves in Background
      const orb1X = width * 0.25 + Math.sin(time * 0.6) * 120;
      const orb1Y = height * 0.35 + Math.cos(time * 0.5) * 90;
      const orb2X = width * 0.75 + Math.cos(time * 0.4) * 140;
      const orb2Y = height * 0.65 + Math.sin(time * 0.7) * 100;
      const orb3X = width * 0.5 + Math.sin(time * 0.3) * 100;
      const orb3Y = height * 0.8 + Math.cos(time * 0.4) * 80;

      // Indigo / Cyan Ambient Glow
      const grad1 = ctx.createRadialGradient(orb1X, orb1Y, 0, orb1X, orb1Y, 400);
      grad1.addColorStop(0, isDark ? 'rgba(56, 189, 248, 0.12)' : 'rgba(56, 189, 248, 0.08)');
      grad1.addColorStop(1, 'transparent');
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      // Purple / Violet Ambient Glow
      const grad2 = ctx.createRadialGradient(orb2X, orb2Y, 0, orb2X, orb2Y, 450);
      grad2.addColorStop(0, isDark ? 'rgba(168, 85, 247, 0.11)' : 'rgba(168, 85, 247, 0.07)');
      grad2.addColorStop(1, 'transparent');
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);

      // Amber / Orange Ambient Glow
      const grad3 = ctx.createRadialGradient(orb3X, orb3Y, 0, orb3X, orb3Y, 380);
      grad3.addColorStop(0, isDark ? 'rgba(245, 158, 11, 0.09)' : 'rgba(245, 158, 11, 0.06)');
      grad3.addColorStop(1, 'transparent');
      ctx.fillStyle = grad3;
      ctx.fillRect(0, 0, width, height);

      // 2. DYNAMIC CURSOR SPOTLIGHT (Signature Gemini interactive aura)
      const cursorDistFromCenter = Math.hypot(mouse.x - width / 2, mouse.y - height / 2);
      const cursorRadius = 340;
      const cursorGlow = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, cursorRadius);
      
      if (isDark) {
        cursorGlow.addColorStop(0, 'rgba(56, 189, 248, 0.28)'); // Cyan core
        cursorGlow.addColorStop(0.25, 'rgba(99, 102, 241, 0.22)'); // Indigo
        cursorGlow.addColorStop(0.55, 'rgba(168, 85, 247, 0.15)'); // Purple
        cursorGlow.addColorStop(0.8, 'rgba(245, 158, 11, 0.08)'); // Amber edge
        cursorGlow.addColorStop(1, 'transparent');
      } else {
        cursorGlow.addColorStop(0, 'rgba(56, 189, 248, 0.2)');
        cursorGlow.addColorStop(0.3, 'rgba(99, 102, 241, 0.14)');
        cursorGlow.addColorStop(0.6, 'rgba(168, 85, 247, 0.09)');
        cursorGlow.addColorStop(1, 'transparent');
      }
      ctx.fillStyle = cursorGlow;
      ctx.fillRect(0, 0, width, height);

      // 3. Floating Interactive Constellation Particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Organic slow motion
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around bounds smoothly
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Interactive mouse gravity / avoidance
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.hypot(dx, dy);

        if (dist < 150) {
          // Subtle magnetic attraction & connection ray to cursor
          const force = (150 - dist) / 150;
          p.x += (dx / dist) * force * 0.8;
          p.y += (dy / dist) * force * 0.8;

          // Draw fine glowing constellation line to mouse
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(99, 102, 241, ${force * 0.35})`;
          ctx.lineWidth = 0.75;
          ctx.stroke();
        }

        // Particle twinkle
        const alpha = p.baseAlpha + Math.sin(time * 3 + p.phase) * 0.2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0.1, Math.min(1, alpha));
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;

        // Connect nearby particles together (constellation web)
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist2 = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist2 < 85) {
            const lineAlpha = (1 - dist2 / 85) * (isDark ? 0.18 : 0.1);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = isDark ? `rgba(148, 163, 184, ${lineAlpha})` : `rgba(100, 116, 139, ${lineAlpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // 4. Click Sparks & Shockwave Update
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vx *= 0.95;
        s.vy *= 0.95;
        s.alpha -= 0.025;

        if (s.alpha <= 0) {
          sparks.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.globalAlpha = s.alpha;
        ctx.shadowBlur = 10;
        ctx.shadowColor = s.color;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('click', handleClick);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0
      }}
    />
  );
};
