import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CaseStudyComponent } from './pages/case-study/case-study.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  
  {path: 'project/:id', component: CaseStudyComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
