import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PSOComponent } from './pso/pso.component';

const routes: Routes = [
  {path:'dashboard', component: DashboardComponent},
  {path:'PSO-game', component:PSOComponent}
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
