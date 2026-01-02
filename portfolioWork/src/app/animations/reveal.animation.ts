// src/app/animations/reveal.animation.ts
import gsap from 'gsap';

export function reveal(element: HTMLElement) {
  gsap.fromTo(
    element,
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
  );
}
// to keep component clean and readable we have moved this animation logic to seperate file.