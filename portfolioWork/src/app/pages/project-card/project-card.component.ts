import { Component, Input } from '@angular/core';
import { ProjectItem } from 'src/app/data';

@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.css']
})
export class ProjectCardComponent {
   @Input() project!: ProjectItem;
    get tags(): string | null {
     return this.project?.tags && this.project.tags.length
       ? this.project.tags.join(' • ')
       : null;
   }
}
