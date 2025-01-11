import { AfterViewInit, Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-pso',
  templateUrl: './pso.component.html',
  styleUrls: ['./pso.component.css']
})
export class PSOComponent implements AfterViewInit {
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D | null;
  private particles: GameParticle[] = [];
  private score = 0;
  private gameActive = false;
  private timer: any;
  private timeLeft!: number;
  private startTime!: number;
  private bestTime: number | null = null;

  private config = {
    numParticles: 100,
    maxScore: 10,
    timerDuration: 60,
    particleSpeed: 1,
  };

  ngAfterViewInit(): void {
    this.canvas = document.getElementById('particleCanvas') as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d');
    if (!this.ctx) return;

    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    const storedBestTime = localStorage.getItem('bestTime');
    if (storedBestTime) {
      this.bestTime = parseFloat(storedBestTime);
      this.updateBestTimeDisplay();
    }

    document.getElementById('startButton')?.addEventListener('click', () => this.startGame());
    document.getElementById('applyConfig')?.addEventListener('click', () => this.applyConfiguration());
    this.canvas.addEventListener('click', (e) => this.handleClick(e));
    this.animate();
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  private applyConfiguration(): void {
    const numParticlesInput = document.getElementById('numParticles') as HTMLInputElement;
    const maxScoreInput = document.getElementById('maxScore') as HTMLInputElement;
    const timerDurationInput = document.getElementById('timerDuration') as HTMLInputElement;
    const particleSpeedInput = document.getElementById('particleSpeed') as HTMLInputElement;

    this.config.numParticles = parseInt(numParticlesInput.value, 10);
    this.config.maxScore = parseInt(maxScoreInput.value, 10);
    this.config.timerDuration = parseInt(timerDurationInput.value, 10);
    this.config.particleSpeed = parseFloat(particleSpeedInput.value);
  }

  private startGame(): void {
    this.applyConfiguration();
    this.score = 0;
    this.gameActive = true;
    this.timeLeft = this.config.timerDuration;
    this.startTime = Date.now();
    this.particles = [];
    for (let i = 0; i < this.config.numParticles; i++) {
      this.particles.push(new GameParticle(this.canvas, this.config.particleSpeed));
    }

    document.getElementById('score')!.textContent = '0';
    document.getElementById('gameMessage')!.textContent = '';
    document.getElementById('timer')!.textContent = `Time Left: ${this.timeLeft}s`;

    if (this.timer) {
      clearInterval(this.timer);
    }

    this.timer = setInterval(() => {
      this.timeLeft--;
      document.getElementById('timer')!.textContent = `Time Left: ${this.timeLeft}s`;

      if (this.timeLeft <= 0) {
        clearInterval(this.timer);
        this.endGame('Try Once Again!');
      }
    }, 1000);
  }

  private handleClick(event: MouseEvent): void {
    if (!this.gameActive) return;

    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    this.particles.forEach((particle) => {
      if (particle.isClicked(x, y)) {
        this.score += particle.getScore();
        document.getElementById('score')!.textContent = this.score.toString();

        if (this.score >= this.config.maxScore) {
          const timeTaken = (Date.now() - this.startTime) / 1000;
          this.updateBestTime(timeTaken);
          this.endGame('You Win!');
        }
      }
    });
  }

  private endGame(message: string): void {
    this.gameActive = false;
    clearInterval(this.timer);
    document.getElementById('gameMessage')!.textContent = message;
  }

  private updateBestTime(timeTaken: number): void {
    if (this.bestTime === null || timeTaken < this.bestTime) {
      this.bestTime = timeTaken;
      localStorage.setItem('bestTime', this.bestTime.toString());
      this.updateBestTimeDisplay();
    }
  }

  private updateBestTimeDisplay(): void {
    const bestTimeDisplay = document.getElementById('bestTime');
    if (this.bestTime !== null) {
      bestTimeDisplay!.textContent = `Best Time: ${this.bestTime.toFixed(2)}s`;
    } else {
      bestTimeDisplay!.textContent = 'Best Time: N/A';
    }
  }

  private animate(): void {
    if (!this.ctx) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (this.gameActive) {
      this.particles.forEach((particle) => {
        particle.update();
        particle.draw(this.ctx!);
      });
    }

    requestAnimationFrame(() => this.animate());
  }
}

class GameParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  type: string;

  constructor(private canvas: HTMLCanvasElement, private speed: number = 1) {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() * 2 - 1) * speed;
    this.vy = (Math.random() * 2 - 1) * speed;
    this.size = Math.random() * 5 + 5;
    this.type = this.getType();
    this.color = this.getColor();
  }

  update(): void {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0 || this.x > this.canvas.width) this.vx *= -1;
    if (this.y < 0 || this.y > this.canvas.height) this.vy *= -1;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  isClicked(mouseX: number, mouseY: number): boolean {
    return Math.hypot(mouseX - this.x, mouseY - this.y) <= this.size;
  }

  getScore(): number {
    return this.type === 'gold' ? 2 : this.type === 'red' ? -1 : 1;
  }

  private getType(): string {
    const rand = Math.random();
    if (rand < 0.1) return 'gold';
    if (rand < 0.2) return 'red';
    return 'regular';
  }

  private getColor(): string {
    switch (this.type) {
      case 'gold': return 'gold';
      case 'red': return 'red';
      default: return 'white';
    }
  }
}
