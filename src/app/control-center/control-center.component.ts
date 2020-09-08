import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

import { CgolService } from '../cgol.service';

@Component({
  selector: 'app-control-center',
  templateUrl: './control-center.component.html',
  styleUrls: ['./control-center.component.css']
})

export class ControlCenterComponent implements OnInit, OnDestroy {

  controlForm: FormGroup;
  boardSize: number; 
  //note - if the string is set to 'ON', the button is currently off
  autoTurnTimerEnabled: boolean = false;
  autoTurnTimerSub: Subscription;
  autoTurnTimeLeft: Subscription;       //ADD ON_DESTROYs!!!
  autoTurnTimerCurrString: string = 'ON';
  autoTurnTimeLeftString: string;
  stopwatchCurrDegrees: number;

  activatedButton: boolean = false;   //for ngClass on turnButton
  activatedButtonAuto: boolean = false;   //for ngClass on auto turnButton


  constructor(private cgolService: CgolService) { }

  ngOnInit() {
    this.controlForm = new FormGroup({
      //'makeTurn': new FormControl(null),
      //'timer': new FormControl(null),
      //'goRandom': new FormControl(null),
      'goRandomAmount': new FormControl(5),
      'boardSize': new FormControl(3)
    });
    this.boardSize = 3;
    this.resetWatchHand();
    this.autoTurnTimerSub = this.cgolService.timerEnabled.subscribe(isEnabled => {
      this.autoTurnTimerEnabled = isEnabled;
      this.handleAutoTurnButtonAppearance();
      this.resetWatchHand();
    });
    this.autoTurnTimeLeft = this.cgolService.timerTimeRemaining.subscribe(timeString => {
      if(this.stopwatchCurrDegrees > 56 || this.stopwatchCurrDegrees < -3) {
        this.stopwatchCurrDegrees -= 6.5;
      }
      else {
        this.stopwatchCurrDegrees -= 5;
      }
      this.autoTurnTimeLeftString = ' ' + timeString;
    })
  }

  onMakeTurn() {
    this.activatedButton = true;
    this.cgolService.makeTurn();
    this.activatedButton = false;
  }

  onAutoTurnTimer() {
    this.autoTurnTimerEnabled ? 
      this.cgolService.stopAutoTimer() :
      this.cgolService.startAutoTimer();
    this.handleAutoTurnButtonAppearance();
    this.resetWatchHand();
  }

  handleAutoTurnButtonAppearance() {
    //switches button to opposite state
    if (this.autoTurnTimerEnabled) {
      this.autoTurnTimerCurrString = 'OFF';
    }
    else {
      this.autoTurnTimerCurrString = 'ON';
    }
    this.activatedButtonAuto = !this.activatedButtonAuto;
  }

  onMakeRandomMark() {
    this.cgolService.makeMarkRandom(this.cgolService.boardSize);
  }

  onRandoDensity() {
    const totNumberOfSquares = this.cgolService.boardSize * this.cgolService.boardSize;
    const randomMarksCount = Math.floor((totNumberOfSquares / 10) * this.controlForm.get('goRandomAmount').value);
    this.cgolService.makeMarkRandom(randomMarksCount);
  }

  onBoardSize() {
    this.cgolService.cgolBoardInit(+this.controlForm.get('boardSize').value);
    this.boardSize = +this.controlForm.get('boardSize').value;
  }

  onClearBoard() {
    this.cgolService.clearAllMarks();
  }

  progressWatchHand() {
    const stopwatchCurrDegreesString = this.stopwatchCurrDegrees + 'deg';
    return {
      'transform': `rotate(${stopwatchCurrDegreesString})`    
    }
  }

  resetWatchHand() {
    this.stopwatchCurrDegrees = 134;
  }

  ngOnDestroy() {
    this.autoTurnTimerSub.unsubscribe();
    this.autoTurnTimeLeft.unsubscribe();
  }
}