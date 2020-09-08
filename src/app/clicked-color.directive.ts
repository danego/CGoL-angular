import { Directive, ElementRef, Renderer2, HostListener } from '@angular/core';

@Directive({
  selector: '[appClickedColor]'
})
export class ClickedColorDirective {
  //make sure to use nativeElement, elementRef is just the refernce, not the actual element
  @HostListener('mouseover') onHover() {

    this.renderer.setStyle(this.elementRef.nativeElement, 'background-color', 'pink');
    this.renderer.setStyle(this.elementRef.nativeElement, 'border', '1px solid red');
  }

  @HostListener('mouseleave') onLeave() {

    this.renderer.setStyle(this.elementRef.nativeElement, 'background-color', 'white');
    this.renderer.setStyle(this.elementRef.nativeElement, 'border', '1px solid white');
    this.renderer.setStyle(this.elementRef.nativeElement, 'outline', 'none');
  }

  constructor(private elementRef: ElementRef, private renderer: Renderer2) { }

}
