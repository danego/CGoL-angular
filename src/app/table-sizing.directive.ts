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

  @HostBinding('style.padding') padding: string;

  @HostListener('window:resize', ['$event']) onResize(event?) {

    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
  }

  constructor(private cgolService: CgolService, private elRef: ElementRef) { }

  ngOnInit() {
    
    this.onResize();
    if (this.elRef.nativeElement.id === 'table-body') {

      const remSize = +this.screenHeight / 50;
      this.padding = String(remSize) + 'rem';
    }
    else {

      const numOfSquares = this.cgolService.boardSize;
      const remSize = +this.screenHeight / numOfSquares / 50;
      this.padding = String(remSize) + 'rem';
    }
  }
}