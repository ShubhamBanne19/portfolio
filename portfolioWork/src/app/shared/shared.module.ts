import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
// import { ProjectCardComponent } from "../";
import { RevealDirective } from "./directive/reveal.directive";

@NgModule({

  imports: [CommonModule, RevealDirective],
  exports: [
    // ProjectCardComponent,
    RevealDirective,
    CommonModule
  ]
})
export class SharedModule {}
