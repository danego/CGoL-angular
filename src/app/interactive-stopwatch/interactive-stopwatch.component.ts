import { Component, Input, Output, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import {CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';

import { CgolService } from '../cgol.service';

@Component({
  selector: 'interactive-stopwatch',
  templateUrl: './interactive-stopwatch.component.html',
  styleUrls: ['./interactive-stopwatch.component.css']
})

export class InteractiveStopwatchComponent implements OnInit, OnDestroy {
  
  @Input() restoredUserAutoTurnDuration: number;
  @Output() autoTurnDurationOutput = new EventEmitter<number>();
  autoTurnTimerEnabled: boolean = false;
  autoTurnTimerSub: Subscription;
  autoTurnTimeLeft: Subscription;
  userSetAutoTurnDuration: number;
  stopwatchCurrDegrees: number;
  timerDragCircles: any[][];
  showMatCardHint: boolean;

  constructor(
    private cgolService: CgolService) { }

  ngOnInit(): void {
    //Drag & Drop List Set Up
    this.timerDragCircles = new Array(12);
    for (let i = 0; i < this.timerDragCircles.length; i++) {
      this.timerDragCircles[i] = [];
    }

    //Set timer values (duration, watch hand, hourglass) to user-restored values
    this.userSetAutoTurnDuration = this.restoredUserAutoTurnDuration;
    this.resetWatchHand();
    this.setHourglassPosition(this.restoredUserAutoTurnDuration);

    this.autoTurnTimerSub = this.cgolService.timerEnabled.subscribe(isEnabled => {
      this.autoTurnTimerEnabled = isEnabled;
      this.resetWatchHand();
    });
    this.autoTurnTimeLeft = this.cgolService.timerTimeRemaining.subscribe(timeString => {
      //do not advance timer hand if first emit
      if (+timeString !== this.userSetAutoTurnDuration) {
        this.stopwatchCurrDegrees -= 6.05;
      }
    });

    this.showMatCardHint = true;
  }

  progressWatchHand() {
    const stopwatchCurrDegreesString = this.stopwatchCurrDegrees + 'deg';
    return {
      'transform': `rotate(${stopwatchCurrDegreesString})`    
    }
  }

  resetWatchHand() {
    // based on the asset images, the watchHand default degrees is -2 at the 45 min mark
    const defaultMinMark = 45;
    const defaultStartingDegrees = -2;
    // used to figure out how many watch marks (15, 20, 25 etc) from default
    const fromSecondsToInterval = 5; 
    const degreesForEachInterval = 30;

    const degreesToAdd = (this.userSetAutoTurnDuration - defaultMinMark) / fromSecondsToInterval;
    this.stopwatchCurrDegrees = defaultStartingDegrees + degreesToAdd * degreesForEachInterval;
  }

  // convert user-set time (60, 55, 30, etc) to correct position of dropLists 
  setHourglassPosition(userSetPosition: number) {
    //index 0 = 60 seconds;  index 11 = 5 seconds
    let hourglassArrayIndex = 12;
    const numberOfClockIntervals = userSetPosition / 5;
    hourglassArrayIndex -= numberOfClockIntervals;

    // add a value to first element corresponding dropList array
    // this will place the Hourglass Icon there
    this.timerDragCircles[hourglassArrayIndex][0] = 'c';
  }

  onAutoTurnTimer(stopTimer?) {
    //for dragging the hourglass ... otherwise it alternates
    if (stopTimer) {
      this.cgolService.stopAutoTimer();
    }
    //for regular stopwatch clicking
    else {
      this.autoTurnTimerEnabled ? 
        this.cgolService.stopAutoTimer() :
        this.cgolService.startAutoTimer(this.userSetAutoTurnDuration);
    }
  }

  //used to stop propagation of clicks from hourglass icon (ie don't start the timer)
  stopPropo(event) {
    event.stopPropagation();
  }

  dropped(event: CdkDragDrop<string[]>) {

    //moveItemInArray(this.timerDragCircles, event.previousIndex, event.currentIndex);
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );
    //cancel timer
    this.onAutoTurnTimer(true);

    const idAsClockTime = 60 - (+event.container.element.nativeElement.id * 5);
    this.userSetAutoTurnDuration = idAsClockTime;
    this.resetWatchHand();

    //send new timer duration to parent component for correct button control
    this.autoTurnDurationOutput.emit(idAsClockTime);
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
