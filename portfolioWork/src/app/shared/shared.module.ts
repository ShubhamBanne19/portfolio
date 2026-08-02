import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RevealDirective } from "./directive/reveal.directive";
import { IconComponent } from "./components/icon/icon.component";
import { PolymathGraphComponent } from "./components/polymath-graph/polymath-graph.component";

@NgModule({
  imports: [CommonModule, RevealDirective, IconComponent, PolymathGraphComponent],
  exports: [
    RevealDirective,
    IconComponent,
    PolymathGraphComponent,
    CommonModule
  ]
})
export class SharedModule {}
