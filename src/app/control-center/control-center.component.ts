import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

import { CgolService } from '../cgol.service';
import { environment } from '../../environments/environment';

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
  userSetTimerDuration: number;
  restoredFromLocalStorageAutoTurnDuration: number;


  constructor(private cgolService: CgolService) { }

  ngOnInit() {
    // NOTE - No form controls for other buttons because they don't change the form state
    this.controlForm = new FormGroup({
      'goRandomAmount': new FormControl(),
      'boardSize': new FormControl() 
    });
    this.recoverFormFromLocalStorage();
    
    this.autoTurnTimerSub = this.cgolService.timerEnabled.subscribe(isEnabled => {

      this.autoTurnTimerEnabled = isEnabled;
      this.handleAutoTurnButtonAppearance(isEnabled);
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
      this.cgolService.startAutoTimer(this.userSetTimerDuration);
  }

  handleAutoTurnButtonAppearance(isEnabled: boolean) {
    //switches button to opposite state of argument/curr state
    if (isEnabled) {
      this.autoTurnTimerCurrString = 'OFF';
    }
    else {
      this.autoTurnTimerCurrString = 'ON';
    }
  }

  //Output reaction function 
  onUpdatedDuration(newTime: number) {
    this.userSetTimerDuration = newTime;
    this.saveHourglassToLocalStorage();
  }

  onMakeRandomMark() {
    this.cgolService.makeMarkRandom(this.cgolService.boardSize);
  }

  //generate specified number of random marks:
  onRandoDensity() {
    const userSelectedRandomAmount = this.controlForm.get('goRandomAmount').value;

    const totNumberOfSquares = this.cgolService.boardSize * this.cgolService.boardSize;
    const randomMarksCount = Math.floor((totNumberOfSquares / 10) * userSelectedRandomAmount);
    this.cgolService.makeMarkRandom(randomMarksCount);
    this.saveFormToLocalStorage();
  }

  onBoardSize() {

    this.cgolService.cgolBoardInit(+this.controlForm.get('boardSize').value);
    this.boardSize = +this.controlForm.get('boardSize').value;
    this.saveFormToLocalStorage();
  }

  onClearBoard() {
    this.cgolService.clearAllMarks();
  }

  recoverFormFromLocalStorage() {
    //for length of timer, set by environment vars or localStorage
    let timerDuration;

    //if there's no previous form in localStorage use use global environment variables
    if (localStorage.getItem('formValues') === null) {
      //Form Values
      const randomAmount = 5;
      const defaultBoardSize = environment.boardSize;

      this.controlForm.setValue({
        'goRandomAmount': randomAmount,
        'boardSize': defaultBoardSize
      });

      timerDuration = environment.timerDuration;
    }
    else {
      //Form Values
      this.controlForm.setValue(
        JSON.parse(localStorage.getItem('formValues'))
      );
  
      timerDuration = +localStorage.getItem('hourglassPosition');
    }
    
    // Sends cgolService the restored boardSize (and thus generates the actual board too)
    // & sets string interpolation value to match board size
    this.onBoardSize();

    //update timerDuration for this component & interactive-stopwatch
    this.restoredFromLocalStorageAutoTurnDuration = timerDuration;
    this.userSetTimerDuration = timerDuration;
    this.saveHourglassToLocalStorage();
  }

  saveFormToLocalStorage() {
    if (this.controlForm.value !== null) {
      localStorage.setItem('formValues', JSON.stringify(this.controlForm.value));
    }
  }
  
  saveHourglassToLocalStorage() {
    if (this.userSetTimerDuration !== null) {
      localStorage.setItem('hourglassPosition', this.userSetTimerDuration.toString());
    }
  }
 
  ngOnDestroy() {
    
    this.autoTurnTimerSub.unsubscribe();
    this.autoTurnTimeLeft.unsubscribe();
  }
}