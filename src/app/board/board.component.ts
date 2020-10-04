import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { CgolService } from '../cgol.service';


@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})

export class BoardComponent implements OnInit, OnDestroy {
  
  boardHtml: boolean[][];
  boardSubscription: Subscription

  constructor(private cgolService: CgolService) { }

  ngOnInit() {

    this.boardSubscription = this.cgolService.boardArraysSub.subscribe((arrayNested: any[][]) => {
      this.boardHtml = arrayNested;
    });
    // must call this (bc order of component initialization), but keep same boardSize (argument of -1)
    this.cgolService.cgolBoardInit(-1);
  }

  onClick(row: number, square: number) {

    this.cgolService.makeMark(row, square);
  }

  checkToStyle(row: number, square: number) {

    if (this.boardHtml[row][square]) {
      return {
        'background-color': 'lightBlue'
      }
    }
    return {
      //'background-color': 'rgba(210, 180, 140, 0.5)'
      'background-color': 'white'
    }
  }

  ngOnDestroy() {
    
    this.boardSubscription.unsubscribe();
  }
}
