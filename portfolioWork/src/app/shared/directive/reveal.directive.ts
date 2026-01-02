import { AfterViewInit, Directive, ElementRef } from "@angular/core";
import { reveal } from "src/app/animations/reveal.animation";


@Directive({
    selector: '[appReveal]',
    standalone: true
})
export class RevealDirective implements AfterViewInit{
    constructor(private el: ElementRef){}

    ngAfterViewInit(): void {
        reveal(this.el.nativeElement);
    }
}