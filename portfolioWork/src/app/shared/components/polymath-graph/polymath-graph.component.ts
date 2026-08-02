import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DomainInfo,
  DomainKey,
  DOMAINS,
  PolymathLink,
  PolymathNode,
  POLYMATH_LINKS,
  POLYMATH_NODES,
} from 'src/app/data/polymath.data';

interface NodePosition {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface Connection {
  other: PolymathNode;
  insight?: string;
}

/**
 * Interactive force-directed constellation of cross-domain skills.
 * Physics + drag are ported from a React prototype (PolymathBrain.jsx).
 * Node/link positions are written directly to the DOM every animation
 * frame - bypassing Angular change detection - since re-running CD for
 * ~30 SVG elements 60 times a second would be wasted work. Everything
 * that changes only on user interaction (selection, legend filters)
 * goes through normal template bindings.
 */
@Component({
  selector: 'app-polymath-graph',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './polymath-graph.component.html',
  styleUrls: ['./polymath-graph.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PolymathGraphComponent implements AfterViewInit, OnDestroy {
  readonly width = 900;
  readonly height = 620;

  readonly domains: Record<DomainKey, DomainInfo> = DOMAINS;
  readonly domainKeys = Object.keys(DOMAINS) as DomainKey[];
  readonly nodes: PolymathNode[] = POLYMATH_NODES;
  readonly links: PolymathLink[] = POLYMATH_LINKS;

  readonly nodeById: Record<string, PolymathNode> = Object.fromEntries(
    this.nodes.map((n) => [n.id, n]),
  );

  private readonly adjacency: Record<string, Set<string>> = (() => {
    const map: Record<string, Set<string>> = {};
    this.nodes.forEach((n) => (map[n.id] = new Set()));
    this.links.forEach((l) => {
      map[l.s].add(l.t);
      map[l.t].add(l.s);
    });
    return map;
  })();

  selected: string | null = null;
  hovered: string | null = null;
  activeDomains: Set<DomainKey> = new Set(this.domainKeys);

  @ViewChild('svgRef') private svgRef!: ElementRef<SVGSVGElement>;
  @ViewChildren('nodeGroup') private nodeGroups!: QueryList<
    ElementRef<SVGGElement>
  >;
  @ViewChildren('linkLine') private linkLines!: QueryList<
    ElementRef<SVGLineElement>
  >;

  private pos: Record<string, NodePosition> = {};
  private rafId: number | null = null;
  private dragId: string | null = null;
  private dragOffsetX = 0;
  private dragOffsetY = 0;

  constructor(private ngZone: NgZone) {}

  ngAfterViewInit(): void {
    this.pos = this.buildInitialPositions();

    const reducedMotion = window.matchMedia?.(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (reducedMotion) {
      for (let i = 0; i < 250; i++) {
        this.physicsStep();
      }
      this.renderPositions();
    } else {
      // Runs forever while this component is mounted — keep it outside the
      // Angular zone so it doesn't trigger a full app change-detection pass
      // on every frame. Position writes below are raw DOM mutations, so
      // Angular never needs to know this loop is running.
      this.ngZone.runOutsideAngular(() => {
        this.rafId = requestAnimationFrame(this.tick);
      });
    }
  }

  ngOnDestroy(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
    }
    window.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('pointerup', this.onPointerUp);
    window.removeEventListener('pointercancel', this.onPointerUp);
  }

  radius(n: PolymathNode): number {
    return 9 + n.size * 3;
  }

  isDim(id: string): boolean {
    if (!this.activeDomains.has(this.nodeById[id].domain)) return true;
    if (!this.selected) return false;
    return id !== this.selected && !this.adjacency[this.selected].has(id);
  }

  isCross(link: PolymathLink): boolean {
    return this.nodeById[link.s].domain !== this.nodeById[link.t].domain;
  }

  touchesSelected(link: PolymathLink): boolean {
    return (
      !!this.selected && (link.s === this.selected || link.t === this.selected)
    );
  }

  toggleDomain(key: DomainKey): void {
    const next = new Set(this.activeDomains);
    next.has(key) ? next.delete(key) : next.add(key);
    this.activeDomains = next;
  }

  selectNode(id: string, event: Event): void {
    event.stopPropagation();
    this.selected = id;
  }

  clearSelection(): void {
    this.selected = null;
  }

  setHovered(id: string | null): void {
    this.hovered = id;
  }

  get selectedNode(): PolymathNode | null {
    return this.selected ? this.nodeById[this.selected] : null;
  }

  get connections(): Connection[] {
    if (!this.selected) return [];
    const selected = this.selected;
    return this.links
      .filter((l) => l.s === selected || l.t === selected)
      .map((l) => {
        const otherId = l.s === selected ? l.t : l.s;
        return { other: this.nodeById[otherId], insight: l.insight };
      });
  }

  trackByNodeId = (_: number, n: PolymathNode) => n.id;
  trackByLinkIndex = (i: number) => i;
  trackByDomainKey = (_: number, k: DomainKey) => k;
  trackByConnection = (_: number, c: Connection) => c.other.id;

  onNodeDown(id: string, event: PointerEvent): void {
    event.stopPropagation();
    this.dragId = id;
    const p = this.toSvgCoords(event);
    const np = this.pos[id];
    this.dragOffsetX = np.x - p.x;
    this.dragOffsetY = np.y - p.y;
    window.addEventListener('pointermove', this.onPointerMove);
    window.addEventListener('pointerup', this.onPointerUp);
    window.addEventListener('pointercancel', this.onPointerUp);
  }

  private buildInitialPositions(): Record<string, NodePosition> {
    const map: Record<string, NodePosition> = {};
    this.nodes.forEach((n) => {
      const di = this.domainKeys.indexOf(n.domain);
      const angle = (di / this.domainKeys.length) * Math.PI * 2;
      const cx = this.width / 2 + Math.cos(angle) * 200;
      const cy = this.height / 2 + Math.sin(angle) * 160;
      map[n.id] = {
        x: cx + (Math.random() - 0.5) * 120,
        y: cy + (Math.random() - 0.5) * 120,
        vx: 0,
        vy: 0,
      };
    });
    return map;
  }

  private physicsStep(): void {
    const pos = this.pos;
    const k = 0.02;
    const rep = 5200;
    const desired = 90;
    const damping = 0.86;
    const nodes = this.nodes;

    for (let i = 0; i < nodes.length; i++) {
      const a = pos[nodes[i].id];
      for (let j = i + 1; j < nodes.length; j++) {
        const b = pos[nodes[j].id];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const d2 = dx * dx + dy * dy || 0.01;
        const d = Math.sqrt(d2);
        const f = rep / d2;
        const fx = (dx / d) * f;
        const fy = (dy / d) * f;
        a.vx += fx;
        a.vy += fy;
        b.vx -= fx;
        b.vy -= fy;
      }
    }

    this.links.forEach((l) => {
      const a = pos[l.s];
      const b = pos[l.t];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const d = Math.sqrt(dx * dx + dy * dy) || 0.01;
      const diff = (d - desired) * k;
      const fx = (dx / d) * diff;
      const fy = (dy / d) * diff;
      a.vx += fx;
      a.vy += fy;
      b.vx -= fx;
      b.vy -= fy;
    });

    nodes.forEach((n) => {
      const p = pos[n.id];
      if (this.dragId === n.id) return;
      p.vx += (this.width / 2 - p.x) * 0.0015;
      p.vy += (this.height / 2 - p.y) * 0.0015;
      p.vx *= damping;
      p.vy *= damping;
      p.x += p.vx;
      p.y += p.vy;
      const r = this.radius(n);
      p.x = Math.max(r, Math.min(this.width - r, p.x));
      p.y = Math.max(r, Math.min(this.height - r, p.y));
    });
  }

  private renderPositions(): void {
    const nodeEls = this.nodeGroups?.toArray() ?? [];
    this.nodes.forEach((n, i) => {
      const p = this.pos[n.id];
      const el = nodeEls[i]?.nativeElement;
      if (el && p) {
        el.setAttribute('transform', `translate(${p.x},${p.y})`);
      }
    });

    const linkEls = this.linkLines?.toArray() ?? [];
    this.links.forEach((l, i) => {
      const a = this.pos[l.s];
      const b = this.pos[l.t];
      const el = linkEls[i]?.nativeElement;
      if (el && a && b) {
        el.setAttribute('x1', String(a.x));
        el.setAttribute('y1', String(a.y));
        el.setAttribute('x2', String(b.x));
        el.setAttribute('y2', String(b.y));
      }
    });
  }

  private tick = (): void => {
    this.physicsStep();
    this.renderPositions();
    this.rafId = requestAnimationFrame(this.tick);
  };

  private onPointerMove = (event: PointerEvent): void => {
    const id = this.dragId;
    if (!id) return;
    const p = this.toSvgCoords(event);
    const np = this.pos[id];
    np.x = p.x + this.dragOffsetX;
    np.y = p.y + this.dragOffsetY;
    np.vx = 0;
    np.vy = 0;
    if (this.rafId === null) {
      this.renderPositions();
    }
  };

  private onPointerUp = (): void => {
    this.dragId = null;
    window.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('pointerup', this.onPointerUp);
    window.removeEventListener('pointercancel', this.onPointerUp);
  };

  private toSvgCoords(event: PointerEvent): { x: number; y: number } {
    const rect = this.svgRef.nativeElement.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * this.width,
      y: ((event.clientY - rect.top) / rect.height) * this.height,
    };
  }
}
