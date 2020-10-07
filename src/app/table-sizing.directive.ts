import { 
  Directive, 
  HostBinding, 
  HostListener,
  OnInit, 
  ElementRef
} from '@angular/core';

import { CgolService } from './cgol.service';

@Directive({
  selector: '[tableSizing]'
})

export class TableSizingDirective implements OnInit{

  screenHeight: number;
  screenWidth: number;

  @HostBinding('style.width') width: string;

  @HostBinding('style.height') height: string;

  @HostListener('window:resize', ['$event']) onResize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
  }
  
  constructor(private elRef: ElementRef) { }
  
  ngOnInit() {
    //get current screen sizes
    this.onResize();

    //Establish correct overall table/board size
    let remSize;
    const maxMobileWidthPX = 500;
    const maxTabletWidthPX = 900;

    //Mobile Sizing
    if (this.screenWidth < maxMobileWidthPX) { 
      remSize = +this.screenWidth / 1.1;
    }  
    //Tablet Sizing
    else if (this.screenWidth < maxTabletWidthPX) { 
      remSize = +this.screenWidth / 1.7;
    }  
    //Laptop Sizing
    else {
      remSize = +this.screenHeight / 1.4;
    }

    remSize = Math.floor(remSize);

    //Attach pixels and pass as string for CSS
    this.width = String(remSize) + 'px';
    this.height = String(remSize) + 'px'; 
  }
}