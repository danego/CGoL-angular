import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { CgolService } from '../cgol.service';

@Component({
  selector: 'app-control-center',
  templateUrl: './control-center.component.html',
  styleUrls: ['./control-center.component.css']
})
export class ControlCenterComponent implements OnInit {
  //@ViewChild('select') selectDropdown;
  controlForm: FormGroup;

  constructor(private cgolService: CgolService) { }

  ngOnInit() {
    this.controlForm = new FormGroup({
      'makeTurn': new FormControl(null),
      'timer': new FormControl(null),
      'goRandom': new FormControl(null),
      'goRandomAmount': new FormControl(),
      'boardSize': new FormControl(null)
    })
  }

  onClick(number) {
    this.cgolService.boardSize;
  }

  onMakeTurn() {
    console.log('maketurn');
  }

  onBoardSize() {
    this.cgolService.cgolBoardInit(+this.controlForm.get('boardSize').value);
  }

}
