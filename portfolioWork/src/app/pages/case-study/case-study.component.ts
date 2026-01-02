// src/app/shared/components/project-card/project-card.component.ts
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { Project } from '../../../models/.model';
import { Project } from 'src/app/models/project.model';

import { RouterLink } from '@angular/router';
import { SeoService } from 'src/app/core/services/seo.service';

@Component({
  selector: 'app-case-study',
  templateUrl: './case-study.component.html',
  styleUrls: ['./case-study.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CaseStudyComponent implements OnInit{
  @Input({ required: true }) project!: Project;
   constructor(private seo: SeoService) {}

  ngOnInit(): void {
    this.seo.setSeo({
      title: 'Portfolio — Case Study',
      description: 'In-depth case study of a front-end project.'
    });
  }
  
}
