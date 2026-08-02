import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ProjectItem, PROJECTS } from 'src/app/data';
import { SeoService } from 'src/app/core/services/seo.service';
import { ScrollAnchorService } from 'src/app/core/services/scroll-anchor.service';

@Component({
  selector: 'app-case-study',
  templateUrl: './case-study.component.html',
  styleUrls: ['./case-study.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CaseStudyComponent implements OnInit, OnDestroy {
  project?: ProjectItem;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private seo: SeoService,
    private scrollAnchor: ScrollAnchorService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const id = params.get('id');
      this.project = PROJECTS.find((p) => p.id === id);

      this.seo.setSeo(
        this.project
          ? { title: `${this.project.title} — Case Study`, description: this.project.short }
          : { title: 'Project not found' }
      );
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  backToProjects(): void {
    this.scrollAnchor.goToSection('projects');
  }


}
