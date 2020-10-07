import { Directive, ElementRef, Renderer2, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { CgolService } from './cgol.service';

@Directive({
  selector: '[appClickedTurn]'
})

export class ClickedTurnDirective implements OnInit, OnDestroy {

  autoTurnTimerEnabled: boolean = false;
  autoTurnButtonColor: string = 'lightgreen';
  autoTurnTimerSub: Subscription;

  constructor (
    private elRef: ElementRef, 
    private renderer: Renderer2,
    private cgolService: CgolService) { }

  ngOnInit() {
    this.renderer.setStyle(this.elRef.nativeElement, 'outline', 'none');

    this.autoTurnTimerSub = this.cgolService.timerEnabled.subscribe(isEnabled => {
      this.autoTurnTimerEnabled = isEnabled;
      
      isEnabled ? 
        this.autoTurnButtonColor = 'red' : 
        this.autoTurnButtonColor = 'lightgreen'

      this.renderer.setStyle(this.elRef.nativeElement, 'background-color', this.autoTurnButtonColor);
    });
  }

  ngOnDestroy() {
    this.autoTurnTimerSub.unsubscribe();
  }
}
