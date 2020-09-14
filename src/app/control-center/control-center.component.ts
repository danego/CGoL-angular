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
  autoTurnTimeLeft: Subscription;
  autoTurnTimerCurrString: string = 'ON';
  autoTurnTimeLeftString: string;


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
    
    this.autoTurnTimerSub = this.cgolService.timerEnabled.subscribe(isEnabled => {

      this.autoTurnTimerEnabled = isEnabled;
      this.handleAutoTurnButtonAppearance();
    });
    this.autoTurnTimeLeft = this.cgolService.timerTimeRemaining.subscribe(timeString => {

      this.autoTurnTimeLeftString = ' ' + timeString;
    });

  }

  onMakeTurn() {
    this.cgolService.makeTurn();
  }

  onAutoTurnTimer() {

    this.autoTurnTimerEnabled ? 
      this.cgolService.stopAutoTimer() :
      this.cgolService.startAutoTimer();
    this.handleAutoTurnButtonAppearance();
  }

  handleAutoTurnButtonAppearance() {
    //switches button to opposite state
    if (this.autoTurnTimerEnabled) {
      this.autoTurnTimerCurrString = 'OFF';
    }
    else {
      this.autoTurnTimerCurrString = 'ON';
    }
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
 
  ngOnDestroy() {

    this.autoTurnTimerSub.unsubscribe();
    this.autoTurnTimeLeft.unsubscribe();
  }
}