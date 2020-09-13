import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import {CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';

import { CgolService } from '../cgol.service';

@Component({
  selector: 'interactive-stopwatch',
  templateUrl: './interactive-stopwatch.component.html',
  styleUrls: ['./interactive-stopwatch.component.css']
})

export class InteractiveStopwatchComponent implements OnInit, OnDestroy {

  autoTurnTimerEnabled: boolean = false;
  autoTurnTimerSub: Subscription;
  autoTurnTimeLeft: Subscription;
  stopwatchCurrDegrees: number;

  timerDragCircles: any[][];


  constructor(private cgolService: CgolService) { }

  ngOnInit(): void {
    //Drag & Drop List Set Up
    this.timerDragCircles = new Array(12);
    for (let i = 0; i < this.timerDragCircles.length; i++) {
      this.timerDragCircles[i] = [];
    }
    this.timerDragCircles[6][0] = 'c';

    this.resetWatchHand();
    this.autoTurnTimerSub = this.cgolService.timerEnabled.subscribe(isEnabled => {

      this.autoTurnTimerEnabled = isEnabled;
      this.resetWatchHand();
    });
    this.autoTurnTimeLeft = this.cgolService.timerTimeRemaining.subscribe(timeString => {

      this.stopwatchCurrDegrees -= 6.1;
    });

  }

  progressWatchHand() {
    const stopwatchCurrDegreesString = this.stopwatchCurrDegrees + 'deg';
    return {
      'transform': `rotate(${stopwatchCurrDegreesString})`    
    }
  }

  resetWatchHand() {

    this.stopwatchCurrDegrees = 269;
  }

  onAutoTurnTimer() {

    this.autoTurnTimerEnabled ? 
      this.cgolService.stopAutoTimer() :
      this.cgolService.startAutoTimer();
    this.resetWatchHand();
  }

  dropped(event: CdkDragDrop<string[]>) {

    //moveItemInArray(this.timerDragCircles, event.previousIndex, event.currentIndex);
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );
    console.log(event.container.element.nativeElement.id);
    //set new timer Overall Time -- through service ...
  }

  applyDragCircleRotate(index) {
    let leftDeg,
        bottomDeg;
    switch(index) {
      case 0:
        leftDeg = 46;
        bottomDeg = 68;
        break;
      case 1: 
        leftDeg = 24;
        bottomDeg = 62.5;
        break;
      case 2: 
        leftDeg = 8;
        bottomDeg = 50;
        break;
      case 3: 
        leftDeg = 3;
        bottomDeg = 34;
        break;
      case 4: 
        leftDeg = 10;
        bottomDeg = 18;
        break;
      case 5: 
        leftDeg = 25;
        bottomDeg = 7;
        break;
      case 6: 
        leftDeg = 46;
        bottomDeg = 3;
        break;
      case 7: 
        leftDeg = 67;
        bottomDeg = 7;
        break;
      case 8: 
        leftDeg = 83;
        bottomDeg = 18;
        break;
      case 9: 
        leftDeg = 89;
        bottomDeg = 35;
        break;
      case 10: 
        leftDeg = 82;
        bottomDeg = 52;
        break;
      case 11: 
        leftDeg = 67;
        bottomDeg = 63;
        break;
    }
    return {
      'left': `${leftDeg}%`,
      'bottom': `${bottomDeg}%` 
    }
  }

  ngOnDestroy() {
    
    this.autoTurnTimerSub.unsubscribe();
    this.autoTurnTimeLeft.unsubscribe();
  }
}
