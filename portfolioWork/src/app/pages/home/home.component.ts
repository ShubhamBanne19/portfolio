import { Component, OnInit } from '@angular/core';
import { ProjectItem, PROJECTS } from 'src/app/data/project.data';
import { Project } from '../../models/project.model';
import { SeoService } from 'src/app/core/services/seo.service';
import { EXPERIENCE, ExperienceItem, PROFILE, SkillGroup, SKILLS } from 'src/app/data';

@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  // projects: ProjectItem[] = PROJECTS;
  readonly profile = PROFILE;
  readonly projects: ProjectItem[] = PROJECTS;
  readonly skills: SkillGroup[] = SKILLS;
  readonly experience: ExperienceItem[] = EXPERIENCE;

  constructor(private seo: SeoService) {}

  // trackBy implementations for performance & stable list rendering
  trackByProject = (_: number, item: ProjectItem) => item.id;
  trackBySkillGroup = (_: number, group: SkillGroup) => group.id ?? group.category;
  trackBySkill = (_: number, skill: { name: string }) => skill.name;
  trackByExperience = (_: number, exp: ExperienceItem) => exp.id ?? `${exp.company}-${exp.startDate}`;
  trackBySocial = (_: number, s: { url: string; label: string }) => s.url ?? s.label;

  // Presentation helper — keeps templates declarative
  formatRange(exp: ExperienceItem): string {
    const start = exp.startDate ?? '';
    const end = exp.endDate === null || exp.endDate === undefined ? 'Present' : exp.endDate;
    return start && end ? `${start} — ${end}` : start || end || '';
  }

  ngOnInit(): void {
    this.seo.setSeo({
      title: 'Shubham Banne',
      description: 'Frontend Engineer portfolio — projects, experience and skills.'
    });
  }
}
