import {
  Component, OnInit, OnDestroy, AfterViewInit,
  ViewChild, ElementRef, ChangeDetectorRef, NgZone
} from '@angular/core';
import { Subscription } from 'rxjs';
import { FestivalService, Festival, FESTIVALS } from '../festival.service';

@Component({
  selector: 'app-festival-overlay',
  standalone: false,
  templateUrl: './festival-overlay.html',
  styleUrl:    './festival-overlay.css',
})
export class FestivalOverlay implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  festival: Festival = 'none';
  showBanner = true;
  readonly festivals = FESTIVALS;
  demoMode = false;
  demoStep = 0;
  demoCountdown = 4;

  private ctx!: CanvasRenderingContext2D;
  private animId = 0;
  private particles: any[] = [];
  private sub!: Subscription;
  private demoInterval: any = null;
  private countdownInterval: any = null;
  private frame = 0;

  constructor(
    public svc: FestivalService,
    private cdr: ChangeDetectorRef,
    private zone: NgZone
  ) {}

  ngOnInit() {
    this.sub = this.svc.festival$.subscribe(f => {
      this.festival = f;
      this.showBanner = true;
      this.particles = [];
      this.frame = 0;
      this.cdr.detectChanges();
      setTimeout(() => { if (this.ctx) this.restartLoop(); }, 30);
    });
  }

  ngAfterViewInit() {
    this.setupCanvas();
    this.restartLoop();
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.animId);
    this.sub?.unsubscribe();
    window.removeEventListener('resize', this.onResize);
    this.stopDemo();
  }

  private onResize = () => this.resize();

  private setupCanvas() {
    if (!this.canvasRef) return;
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.resize();
    window.addEventListener('resize', this.onResize);
  }

  private resize() {
    if (!this.canvasRef) return;
    const c = this.canvasRef.nativeElement;
    c.width  = window.innerWidth;
    c.height = window.innerHeight;
  }

  private restartLoop() {
    cancelAnimationFrame(this.animId);
    this.particles = [];
    this.frame = 0;
    if (this.festival !== 'none') {
      if (!this.ctx && this.canvasRef) this.setupCanvas();
      this.zone.runOutsideAngular(() => this.loop());
    }
  }

  private loop() {
    if (!this.ctx || !this.canvasRef) return;
    const ctx = this.ctx;
    const W = this.canvasRef.nativeElement.width;
    const H = this.canvasRef.nativeElement.height;
    this.frame++;

    ctx.clearRect(0, 0, W, H);

    switch (this.festival) {
      case 'diwali':    this.tickDiwali(ctx, W, H);    break;
      case 'holi':      this.tickHoli(ctx, W, H);      break;
      case 'christmas': this.tickChristmas(ctx, W, H); break;
    }

    this.animId = requestAnimationFrame(() => this.loop());
  }

  // ══════════════════════════════════════════════════════════
  //  DIWALI  — Crazy intense fireworks everywhere
  // ══════════════════════════════════════════════════════════
  private tickDiwali(ctx: CanvasRenderingContext2D, W: number, H: number) {
    const COLORS = [
      '#ff6b00','#ffd700','#ff3d00','#ff69b4',
      '#c084fc','#67e8f9','#4ade80','#fff',
      '#f472b6','#fb923c','#a78bfa'
    ];

    // Launch multiple rockets per frame for crazy effect
    const launchRate = this.frame < 120 ? 0.15 : 0.055;
    if (Math.random() < launchRate) {
      const count = this.frame < 60 ? 3 : 1;
      for (let n = 0; n < count; n++) {
        const x = W * 0.05 + Math.random() * W * 0.9;
        const targetY = H * 0.05 + Math.random() * H * 0.5;
        const c1 = COLORS[Math.floor(Math.random() * COLORS.length)];
        const c2 = COLORS[Math.floor(Math.random() * COLORS.length)];
        const speed = 13 + Math.random() * 9;
        this.particles.push({
          x, y: H + 5,
          vx: (Math.random() - 0.5) * 2.5,
          vy: -speed,
          size: 2.5 + Math.random() * 2,
          color: '#fff',
          life: 999, maxLife: 999,
          drag: 0.985, gravity: 0.2,
          isRocket: true, targetY, exploded: false, c1, c2,
          trail: [] as {x:number,y:number}[],
        });
      }
    }

    // Ground sparklers at bottom
    if (this.frame % 8 === 0) {
      const sx = Math.random() * W;
      for (let i = 0; i < 8; i++) {
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 0.7;
        const speed = 1.5 + Math.random() * 3;
        this.particles.push({
          x: sx, y: H - 5,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 1.5 + Math.random() * 2,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          life: 30 + Math.random() * 25,
          maxLife: 55,
          drag: 0.97, gravity: 0.15,
        });
      }
    }

    // Explode rockets
    const toExplode: any[] = [];
    this.particles = this.particles.filter(p => {
      if (p.life <= 0) return false;
      if (p.isRocket && !p.exploded && p.y <= p.targetY) {
        p.exploded = true; toExplode.push(p); return false;
      }
      return true;
    });

    for (const p of toExplode) {
      const style = Math.floor(Math.random() * 3); // 0=circle, 1=star, 2=ring
      const count = 110 + Math.floor(Math.random() * 80);
      for (let i = 0; i < count; i++) {
        let angle = (Math.PI * 2 / count) * i;
        let speed = 2 + Math.random() * 5;
        if (style === 1) {
          // Star burst – alternating fast/slow
          speed = i % 2 === 0 ? 2 + Math.random() * 3 : 1 + Math.random() * 5;
        } else if (style === 2) {
          // Ring – uniform speed with noise
          speed = 3.5 + (Math.random() - 0.5) * 0.8;
        }
        this.particles.push({
          x: p.x, y: p.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 1.5 + Math.random() * 3,
          color: i % 2 === 0 ? p.c1 : p.c2,
          life: 55 + Math.random() * 50,
          maxLife: 105,
          drag: 0.925 + Math.random() * 0.025,
          gravity: 0.05 + Math.random() * 0.05,
        });
      }
      // Secondary mini-burst
      for (let i = 0; i < 30; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.5 + Math.random() * 2;
        this.particles.push({
          x: p.x + (Math.random()-0.5)*20, y: p.y + (Math.random()-0.5)*20,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 1 + Math.random() * 1.5,
          color: '#fff8',
          life: 20 + Math.random() * 20, maxLife: 40,
          drag: 0.95, gravity: 0.04,
        });
      }
    }

    // Draw particles
    for (const p of this.particles) {
      if (p.isRocket) {
        p.trail.unshift({ x: p.x, y: p.y });
        if (p.trail.length > 14) p.trail.pop();
      }
      p.x   += p.vx;
      p.y   += p.vy;
      p.vy  += p.gravity ?? 0;
      p.life--;
      if (p.drag) { p.vx *= p.drag; p.vy *= p.drag; }

      if (p.isRocket) {
        // Draw trail
        for (let t = 0; t < p.trail.length; t++) {
          const a = (1 - t / p.trail.length) * 0.7;
          ctx.save();
          ctx.globalAlpha = a;
          ctx.fillStyle = '#fff';
          ctx.shadowBlur = 8;
          ctx.shadowColor = '#ffd700';
          ctx.beginPath();
          ctx.arc(p.trail[t].x, p.trail[t].y, p.size * (1 - t/p.trail.length), 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
        // Head
        ctx.save();
        ctx.globalAlpha = 0.9;
        ctx.fillStyle = '#fff';
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#ffd700';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      } else {
        const alpha = Math.min(1, (p.life / p.maxLife) * 2);
        ctx.save();
        ctx.globalAlpha = Math.max(0, alpha);
        ctx.fillStyle   = p.color;
        ctx.shadowBlur  = 18;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
  }

  // ══════════════════════════════════════════════════════════
  //  HOLI  — Crazy colorful powder bombs everywhere
  // ══════════════════════════════════════════════════════════
  private tickHoli(ctx: CanvasRenderingContext2D, W: number, H: number) {
    const COLORS = [
      '#ff3d6b','#ff6b00','#ffd700','#00e676',
      '#00b0ff','#d500f9','#ff4081','#76ff03',
      '#ffea00','#00e5ff','#ff6e40','#b2ff59'
    ];

    // Massive burst on startup
    const burstRate = this.frame < 60 ? 0.9 : 0.18;

    if (Math.random() < burstRate) {
      const numBursts = this.frame < 60 ? 5 : 1 + Math.floor(Math.random() * 3);
      for (let b = 0; b < numBursts; b++) {
        const x = Math.random() * W;
        const y = Math.random() * H;
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];
        const color2 = COLORS[Math.floor(Math.random() * COLORS.length)];
        const cnt = 50 + Math.floor(Math.random() * 60);
        for (let i = 0; i < cnt; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 1.5 + Math.random() * 8;
          this.particles.push({
            x, y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 2,
            size: 4 + Math.random() * 14,
            color: i % 2 === 0 ? color : color2,
            scaleY: 0.3 + Math.random() * 0.5,
            life: 60 + Math.random() * 80,
            maxLife: 140,
            gravity: 0.12 + Math.random() * 0.1,
            drag: 0.955 + Math.random() * 0.02,
          });
        }
        // Ring wave
        for (let i = 0; i < 24; i++) {
          const angle = (Math.PI * 2 / 24) * i;
          this.particles.push({
            x, y,
            vx: Math.cos(angle) * (6 + Math.random() * 4),
            vy: Math.sin(angle) * (6 + Math.random() * 4),
            size: 6 + Math.random() * 10,
            color,
            scaleY: 1,
            life: 40 + Math.random() * 30,
            maxLife: 70,
            gravity: 0.05, drag: 0.92,
          });
        }
      }
    }

    // Falling color drops from top
    if (this.frame % 3 === 0) {
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.particles.push({
        x: Math.random() * W, y: -10,
        vx: (Math.random() - 0.5) * 4,
        vy: 3 + Math.random() * 6,
        size: 5 + Math.random() * 12,
        color, scaleY: 1.4,
        life: 80 + Math.random() * 60, maxLife: 140,
        gravity: 0.2, drag: 0.99,
      });
    }

    // Screen tint overlay
    const hue = (this.frame * 2) % 360;
    ctx.save();
    ctx.globalAlpha = 0.04;
    ctx.fillStyle = `hsl(${hue}, 100%, 60%)`;
    ctx.fillRect(0, 0, W, H);
    ctx.restore();

    this.particles = this.particles.filter(p => p.life > 0);
    for (const p of this.particles) {
      p.x   += p.vx;
      p.y   += p.vy;
      p.vy  += p.gravity;
      p.vx  *= p.drag;
      p.vy  *= p.drag;
      p.life--;

      const alpha  = (p.life / p.maxLife) * 0.92;
      const rotate = Math.atan2(p.vy, p.vx);
      ctx.save();
      ctx.globalAlpha = Math.max(0, alpha);
      ctx.fillStyle   = p.color;
      ctx.shadowBlur  = 20;
      ctx.shadowColor = p.color;
      ctx.translate(p.x, p.y);
      ctx.rotate(rotate);
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size, Math.max(1, p.size * p.scaleY), 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // ══════════════════════════════════════════════════════════
  //  CHRISTMAS  — Dense snowfall + Santa sleigh
  // ══════════════════════════════════════════════════════════
  private santaX = -300;
  private santaDir = 1;
  private santaY = 0;
  private lastSantaTime = 0;

  private tickChristmas(ctx: CanvasRenderingContext2D, W: number, H: number) {
    // Fill up snowflakes fast initially
    const target = 350;
    const add = this.particles.length < target ? (this.frame < 60 ? 12 : 3) : 0;
    for (let i = 0; i < add; i++) {
      this.particles.push({
        x: Math.random() * W,
        y: this.frame < 60 ? Math.random() * H : -10 - Math.random() * 50,
        vy: 0.5 + Math.random() * 2.2,
        vx: (Math.random() - 0.5) * 0.6,
        size: 1 + Math.random() * 5.5,
        opacity: 0.3 + Math.random() * 0.7,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.006 + Math.random() * 0.02,
        isSnow: true,
      });
    }

    // Screen blue tint for cold feel
    ctx.save();
    ctx.globalAlpha = 0.06;
    ctx.fillStyle = '#0a1a4a';
    ctx.fillRect(0, 0, W, H);
    ctx.restore();

    // Snowflakes
    this.particles = this.particles.filter(p => p.y < H + 30);
    for (const p of this.particles) {
      p.wobble += p.wobbleSpeed;
      p.x += Math.sin(p.wobble) * 0.8 + p.vx;
      p.y += p.vy;
      // wrap horizontally
      if (p.x < -10) p.x = W + 10;
      if (p.x > W + 10) p.x = -10;

      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = '#fff';
      ctx.shadowBlur = p.size > 3 ? 12 : 6;
      ctx.shadowColor = 'rgba(180,210,255,0.9)';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Santa sleigh (passes every ~12s)
    const now = this.frame;
    if (now - this.lastSantaTime > 720 || this.frame === 0) {
      this.santaX = -280;
      this.santaY = H * 0.08 + Math.random() * H * 0.15;
      this.lastSantaTime = now;
      this.santaDir = 1;
    }
    if (this.santaX > -280 && this.santaX < W + 280) {
      this.santaX += 3.5 * this.santaDir;
      this.drawSanta(ctx, this.santaX, this.santaY, W);
    }
  }

  private drawSanta(ctx: CanvasRenderingContext2D, x: number, y: number, W: number) {
    ctx.save();
    ctx.globalAlpha = 0.92;
    const flip = this.santaDir === -1 ? -1 : 1;
    ctx.translate(x, y);
    ctx.scale(flip, 1);

    // Sleigh rope string (wobbles)
    const bob = Math.sin(this.frame * 0.08) * 4;

    // Reindeer (3 simple silhouettes)
    for (let r = 0; r < 3; r++) {
      const rx = -200 + r * 65;
      const ry = bob + Math.sin((this.frame * 0.1) + r) * 3;
      ctx.fillStyle = '#8b4513';
      // body
      ctx.beginPath();
      ctx.ellipse(rx, ry, 22, 10, 0, 0, Math.PI * 2);
      ctx.fill();
      // head
      ctx.beginPath();
      ctx.ellipse(rx + 26, ry - 5, 10, 8, -0.3, 0, Math.PI * 2);
      ctx.fill();
      // antlers
      ctx.strokeStyle = '#6b3410';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(rx+30, ry-12); ctx.lineTo(rx+38, ry-22); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(rx+38, ry-22); ctx.lineTo(rx+34, ry-28); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(rx+38, ry-22); ctx.lineTo(rx+44, ry-27); ctx.stroke();
      // legs
      ctx.strokeStyle = '#8b4513'; ctx.lineWidth = 3;
      for (let l = 0; l < 4; l++) {
        const lx = rx - 14 + l * 8;
        const legSwing = Math.sin((this.frame * 0.2) + r + l) * 6;
        ctx.beginPath(); ctx.moveTo(lx, ry+8); ctx.lineTo(lx + legSwing, ry+20); ctx.stroke();
      }
      // Red nose on lead reindeer
      if (r === 0) {
        ctx.fillStyle = '#ff3030';
        ctx.shadowBlur = 12; ctx.shadowColor = '#ff3030';
        ctx.beginPath(); ctx.arc(rx+36, ry-5, 5, 0, Math.PI*2); ctx.fill();
        ctx.shadowBlur = 0;
      }
      // String to sleigh
      ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(rx+20, ry); ctx.lineTo(rx+80, ry+5); ctx.stroke();
    }

    // Sleigh body
    ctx.fillStyle = '#8b0000';
    ctx.beginPath();
    ctx.moveTo(-30, bob + 8);
    ctx.quadraticCurveTo(20, bob - 20, 70, bob + 5);
    ctx.lineTo(70, bob + 22);
    ctx.quadraticCurveTo(20, bob + 30, -30, bob + 22);
    ctx.closePath();
    ctx.fill();

    // Sleigh runners
    ctx.fillStyle = '#4a0000';
    ctx.beginPath(); ctx.ellipse(20, bob+28, 55, 5, 0, 0, Math.PI*2); ctx.fill();

    // Gift bag
    ctx.fillStyle = '#1a5c1a';
    ctx.beginPath(); ctx.ellipse(30, bob - 8, 20, 18, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#ffd700'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(30, bob-26); ctx.lineTo(30, bob+10); ctx.strokeStyle='#ffd700'; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(10, bob-8); ctx.lineTo(50, bob-8); ctx.stroke();

    // Santa
    // body (red coat)
    ctx.fillStyle = '#cc0000';
    ctx.beginPath(); ctx.ellipse(0, bob, 18, 22, 0, 0, Math.PI*2); ctx.fill();
    // white trim
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.ellipse(0, bob+16, 18, 7, 0, 0, Math.PI*2); ctx.fill();
    // head
    ctx.fillStyle = '#f5cba7';
    ctx.beginPath(); ctx.arc(0, bob-28, 14, 0, Math.PI*2); ctx.fill();
    // hat
    ctx.fillStyle = '#cc0000';
    ctx.beginPath(); ctx.moveTo(-14, bob-28); ctx.lineTo(-8, bob-52); ctx.lineTo(8, bob-52); ctx.lineTo(14, bob-28); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.ellipse(0, bob-28, 15, 5, 0, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(0, bob-52, 5, 0, Math.PI*2); ctx.fill();
    // beard
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.ellipse(0, bob-14, 12, 10, 0, 0, Math.PI*2); ctx.fill();

    ctx.restore();
  }

  get config() { return this.svc.config; }
  dismissBanner() { this.showBanner = false; }

  // ── Demo mode ─────────────────────────────────────────────
  readonly DEMO_ORDER: Festival[] = ['diwali', 'holi', 'christmas'];

  toggleDemo() { this.demoMode ? this.stopDemo() : this.startDemo(); }

  private startDemo() {
    this.demoMode = true;
    this.demoStep = 0;
    this.demoCountdown = 5;
    this.svc.setFestival(this.DEMO_ORDER[0]);
    this.cdr.detectChanges();

    this.demoInterval = setInterval(() => {
      this.demoStep = (this.demoStep + 1) % this.DEMO_ORDER.length;
      this.demoCountdown = 5;
      this.svc.setFestival(this.DEMO_ORDER[this.demoStep]);
      this.cdr.detectChanges();
    }, 5000);

    this.countdownInterval = setInterval(() => {
      this.demoCountdown = Math.max(0, this.demoCountdown - 1);
      this.cdr.detectChanges();
    }, 1000);
  }

  private stopDemo() {
    this.demoMode = false;
    clearInterval(this.demoInterval);
    clearInterval(this.countdownInterval);
    this.demoInterval = null;
    this.countdownInterval = null;
    this.svc.setFestival('none');
    this.cdr.detectChanges();
  }
}
