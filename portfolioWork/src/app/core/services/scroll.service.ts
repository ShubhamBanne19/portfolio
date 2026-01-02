import Lenis from '@studio-freight/lenis';

export class ScrollService {
  private lenis = new Lenis({ smooth: true } as any);

  constructor() {
    const raf = (time: number) => {
      this.lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }
}
