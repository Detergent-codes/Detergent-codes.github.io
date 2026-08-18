/**
 * High-Performance Gas-Spring Dot Matrix & Parallax Engine
 * Fully configured and controlled via PORTFOLIO_CONFIG
 */

class GasSpringDotMatrix {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.dots = [];

    // Read settings from config or safe defaults
    const cfg = (window.PORTFOLIO_CONFIG && window.PORTFOLIO_CONFIG.effects) || {};
    this.spacing = cfg.dotSpacing || 34;
    this.baseDotSize = cfg.baseDotSize || 1.4;
    this.hoverDotSize = cfg.hoverDotSize || 2.4;
    this.grayColor = cfg.baseDotColor || { r: 156, g: 163, b: 175, a: 0.30 };
    this.emeraldColor = cfg.hoverDotColor || { r: 16, g: 185, b: 129, a: 0.95 };

    this.proximityRadius = cfg.proximityRadius || 120;
    this.repulsionForce = cfg.repulsionForce || 4.0;
    this.hoverFloatSpeed = cfg.hoverFloatSpeed || 0.8;
    this.hoverFloatAmp = cfg.hoverFloatAmp || 1.6;

    this.gasSpring = cfg.gasSpringStrength || 0.045;
    this.damping = cfg.gasSpringDamping || 0.82;
    this.scrollInfluence = cfg.scrollInfluence || 0.10;

    this.mouse = {
      x: -1000,
      y: -1000
    };

    this.lastScrollY = window.pageYOffset;

    this.resize();
    this.initGrid();
    this.bindEvents();
    this.animate();
  }

  resize() {
    this.dpr = window.devicePixelRatio || 1;
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.ctx.scale(this.dpr, this.dpr);

    if (this.width < 768) {
      this.currentSpacing = this.spacing + 6;
      this.currentRadius = this.proximityRadius * 0.75;
    } else {
      this.currentSpacing = this.spacing;
      this.currentRadius = this.proximityRadius;
    }

    this.initGrid();
  }

  initGrid() {
    this.dots = [];
    const cols = Math.ceil(this.width / this.currentSpacing) + 1;
    const rows = Math.ceil(this.height / this.currentSpacing) + 1;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const ox = c * this.currentSpacing;
        const oy = r * this.currentSpacing;
        this.dots.push({
          ox: ox,
          oy: oy,
          x: ox,
          y: oy,
          vx: 0,
          vy: 0,
          size: this.baseDotSize,
          hoverRatio: 0,
          phase: (ox * 0.04) + (oy * 0.04) // Smooth harmonic phase
        });
      }
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => this.resize());

    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      this.mouse.x = -1000;
      this.mouse.y = -1000;
    });

    // Gas-Spring Scroll Reaction (Smooth, linear-ish, viscous displacement)
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;
      const delta = currentScroll - this.lastScrollY;
      this.lastScrollY = currentScroll;

      // Bound delta to prevent harsh impulses
      const clampedDelta = Math.max(-12, Math.min(12, delta));
      const displacement = clampedDelta * this.scrollInfluence;

      // Linear viscous nudge
      for (let i = 0; i < this.dots.length; i++) {
        const d = this.dots[i];
        d.vy -= displacement * 0.45;
      }
    }, { passive: true });
  }

  animate(timestamp = 0) {
    this.ctx.clearRect(0, 0, this.width, this.height);

    const time = timestamp * 0.001; // Seconds
    const radius = this.currentRadius;
    const mouseX = this.mouse.x;
    const mouseY = this.mouse.y;

    for (let i = 0; i < this.dots.length; i++) {
      const dot = this.dots[i];

      const dx = dot.x - mouseX;
      const dy = dot.y - mouseY;
      const dist = Math.hypot(dx, dy);

      if (dist < radius && dist > 0) {
        const proximity = 1 - dist / radius; // 0 to 1

        // 1. Smooth repulsion
        const force = proximity * this.repulsionForce;
        dot.vx += (dx / dist) * force;
        dot.vy += (dy / dist) * force;

        // 2. Slow, graceful floating/hovering around cursor (no fast jiggle)
        const floatSpeed = this.hoverFloatSpeed;
        const floatAmp = proximity * this.hoverFloatAmp;
        const floatX = Math.sin(time * floatSpeed + dot.phase) * floatAmp * 0.08;
        const floatY = Math.cos(time * floatSpeed * 0.9 + dot.phase) * floatAmp * 0.08;
        dot.vx += floatX;
        dot.vy += floatY;

        // Transition to emerald green & size
        dot.hoverRatio += (proximity - dot.hoverRatio) * 0.2;
        dot.size = this.baseDotSize + proximity * (this.hoverDotSize - this.baseDotSize);
      } else {
        // Return to neutral gray and base size
        dot.hoverRatio += (0 - dot.hoverRatio) * 0.07;
        dot.size += (this.baseDotSize - dot.size) * 0.07;
      }

      // Gas-Spring Return Physics (Overdamped, linear viscous settling)
      const diffX = dot.ox - dot.x;
      const diffY = dot.oy - dot.y;
      dot.vx += diffX * this.gasSpring;
      dot.vy += diffY * this.gasSpring;
      dot.vx *= this.damping;
      dot.vy *= this.damping;
      dot.x += dot.vx;
      dot.y += dot.vy;

      // Color Interpolation (Gray -> Emerald)
      const hr = Math.max(0, Math.min(1, dot.hoverRatio));
      const r = Math.round(this.grayColor.r + (this.emeraldColor.r - this.grayColor.r) * hr);
      const g = Math.round(this.grayColor.g + (this.emeraldColor.g - this.grayColor.g) * hr);
      const b = Math.round(this.grayColor.b + (this.emeraldColor.b - this.grayColor.b) * hr);
      const a = this.grayColor.a + (this.emeraldColor.a - this.grayColor.a) * hr;

      // Draw dot
      this.ctx.beginPath();
      this.ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;

      if (hr > 0.3) {
        this.ctx.shadowColor = `rgba(${this.emeraldColor.r}, ${this.emeraldColor.g}, ${this.emeraldColor.b}, 0.6)`;
        this.ctx.shadowBlur = 8 * hr;
      } else {
        this.ctx.shadowBlur = 0;
      }

      this.ctx.fill();
    }

    this.ctx.shadowBlur = 0;
    requestAnimationFrame((t) => this.animate(t));
  }
}

/**
 * Instant, Responsive Hero Parallax Controller
 */
class HeroParallaxController {
  constructor() {
    this.bg = document.querySelector('.hero-parallax-bg');
    this.header = document.querySelector('.site-header');
    
    const cfg = (window.PORTFOLIO_CONFIG && window.PORTFOLIO_CONFIG.heroParallax) || {};
    this.enabled = cfg.enabled !== false;
    this.scrollSpeed = cfg.scrollSpeed || 0.38;
    this.mouseTilt = cfg.mouseTiltFactor || 0.02;

    this.mouseX = 0;
    this.mouseY = 0;
    this.scrollY = window.pageYOffset;
    this.ticking = false;

    this.init();
  }

  init() {
    if (!this.bg || !this.enabled) return;

    window.addEventListener('scroll', () => {
      this.scrollY = window.pageYOffset;
      if (this.header) {
        if (this.scrollY > 50) {
          this.header.classList.add('scrolled');
        } else {
          this.header.classList.remove('scrolled');
        }
      }
      this.requestRender();
    }, { passive: true });

    window.addEventListener('mousemove', (e) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      this.mouseX = (e.clientX - cx) * this.mouseTilt;
      this.mouseY = (e.clientY - cy) * this.mouseTilt;
      this.requestRender();
    });

    this.render();
  }

  requestRender() {
    if (!this.ticking) {
      requestAnimationFrame(() => {
        this.render();
        this.ticking = false;
      });
      this.ticking = true;
    }
  }

  render() {
    if (!this.bg) return;
    if (this.scrollY < window.innerHeight * 1.5) {
      const translateY = this.scrollY * this.scrollSpeed;
      this.bg.style.transform = `translate3d(${this.mouseX.toFixed(2)}px, ${(translateY + this.mouseY).toFixed(2)}px, 0)`;
    }
  }
}

/**
 * Spotlight Card Glow Tracker
 */
function initCardSpotlight() {
  document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.spotlight-card, .discord-widget-card');
    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  window.gasSpringMatrix = new GasSpringDotMatrix('ambient-canvas');
  window.heroParallax = new HeroParallaxController();
  initCardSpotlight();
});
