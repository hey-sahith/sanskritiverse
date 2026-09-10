// Celebratory Canvas Confetti Particle Burst for SanskritiVerse

export function fireConfetti() {
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '99999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ['#f59e0b', '#ea580c', '#ef4444', '#10b981', '#3b82f6', '#8b5cf6', '#ffd700'];
  const particles = [];
  const particleCount = 120;

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: canvas.width / 2 + (Math.random() * 200 - 100),
      y: canvas.height * 0.45,
      vx: (Math.random() - 0.5) * 14,
      vy: Math.random() * -12 - 4,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 12,
      opacity: 1,
      gravity: 0.35
    });
  }

  let animationFrame;
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.rotation += p.rotationSpeed;
      p.opacity -= 0.009;

      if (p.opacity > 0 && p.y < canvas.height) {
        alive = true;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.7);
        ctx.restore();
      }
    });

    if (alive) {
      animationFrame = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(animationFrame);
      if (canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
    }
  }

  animate();
}
