import { Component, OnInit, ViewChild } from '@angular/core';
import { ProjectItem, PROJECTS } from 'src/app/data/project.data';
import { Project } from '../../models/project.model';
import { SeoService } from 'src/app/core/services/seo.service';
import { EXPERIENCE, ExperienceItem, PROFILE, SkillGroup, SKILLS } from 'src/app/data';

/**
 * HOME COMPONENT with integrated CINEMATIC HERO ANIMATION
 * 
 * Features:
 * - Cinematic hero animation (optional, can be toggled)
 * - Integrated data display (experience, projects, skills)
 * - Performance-optimized rendering with trackBy functions
 * - SEO optimization
 */
@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  // @ViewChild('heroAnimation') heroAnimation?: HeroAnimationComponent;

  readonly profile = PROFILE;
  readonly projects: ProjectItem[] = PROJECTS;
  readonly skills: SkillGroup[] = SKILLS;
  readonly experience: ExperienceItem[] = EXPERIENCE;

  // Hero animation configuration
  enableHeroAnimation = true;
  heroAnimationComplete = false;

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

  /**
   * Handle hero animation completion
   * Can trigger reveal of rest of page or other actions
   */
  onHeroAnimationComplete(): void {
    this.heroAnimationComplete = true;
    console.log('✨ Hero animation complete — page content ready');
  }

  /**
   * Control hero animation playback
   */
  // restartHeroAnimation(): void {
  //   this.heroAnimation?.restart();
  // }

  // pauseHeroAnimation(): void {
  //   this.heroAnimation?.pause();
  // }

  // playHeroAnimation(): void {
  //   this.heroAnimation?.play();
  // }

  ngOnInit(): void {
    this.seo.setSeo({
      title: 'Shubham Banne — Senior Angular Developer & Technology Analyst',
      description: 'Cinematic portfolio showcasing engineering precision, enterprise systems design, and modern web architecture.'
    });
  }
}
