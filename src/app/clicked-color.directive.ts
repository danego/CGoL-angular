import { Directive, OnInit, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appClickedColor]'
})
export class ClickedColorDirective implements OnInit{

  constructor(private elementRef: ElementRef, private renderer: Renderer2) { }

  ngOnInit() {
    //make sure to use nativeElement, elementRef is just the refernce, not the actual element
    this.renderer.setStyle(this.elementRef.nativeElement, 'background-color', 'yellow');
  }

}
