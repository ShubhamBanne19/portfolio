import { Component, OnInit } from '@angular/core';
import { SeoService } from 'src/app/core/services/seo.service';
import {
  Achievement,
  ACHIEVEMENTS,
  EXPERIENCE,
  ExperienceItem,
  PROFILE,
  ProjectItem,
  PROJECTS,
  SEO,
  SkillGroup,
  SKILLS,
} from 'src/app/data';
import { IconName } from 'src/app/shared/models/icon.model';
import { trackBySocial } from 'src/app/shared/utils/track-by';

const SKILL_CATEGORY_ICONS: Record<string, IconName> = {
  frontend: 'code',
  backend: 'server',
  database: 'database',
  tools: 'tool',
};

@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  readonly profile = PROFILE;
  readonly projects: ProjectItem[] = PROJECTS;
  readonly skills: SkillGroup[] = SKILLS;
  readonly experience: ExperienceItem[] = EXPERIENCE;

  readonly certifications: Achievement[] = ACHIEVEMENTS.filter(
    (a) => a.type === 'certification',
  );
  readonly awards: Achievement[] = ACHIEVEMENTS.filter(
    (a) => a.type === 'award',
  );

  constructor(private seo: SeoService) {}

  ngOnInit(): void {
    this.seo.setSeo({
      title: SEO.defaultTitle,
      description: SEO.description,
    });
  }

  // trackBy implementations for performance & stable list rendering
  trackByProject = (_: number, item: ProjectItem) => item.id;
  trackBySkillGroup = (_: number, group: SkillGroup) =>
    group.id ?? group.category;
  trackBySkill = (_: number, skill: { name: string }) => skill.name;
  trackByExperience = (_: number, exp: ExperienceItem) =>
    exp.id ?? `${exp.company}-${exp.startDate}`;
  readonly trackBySocial = trackBySocial;
  trackByAchievement = (_: number, a: Achievement) => a.id ?? a.title;

  // Presentation helper - keeps templates declarative
  formatRange(exp: ExperienceItem): string {
    const start = exp.startDate ?? '';
    const end =
      exp.endDate === null || exp.endDate === undefined
        ? 'Present'
        : exp.endDate;
    return start && end ? `${start} - ${end}` : start || end || '';
  }

  skillCategoryIcon(group: SkillGroup): IconName {
    return SKILL_CATEGORY_ICONS[group.id ?? ''] ?? 'code';
  }
}
