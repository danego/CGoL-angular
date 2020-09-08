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
    this.cgolService.cgolBoardInit(3);
  }

  onClick(row: number, square: number) {

    this.cgolService.makeMark(row, square);
  }

  checkToStyle(row: number, square: number) {

    if (this.boardHtml[row][square]) {
      return {
        'background-color': 'yellow'
      }
    }
    return {
      'background-color': 'coral'
    }
  }

  ngOnDestroy() {
    
    this.boardSubscription.unsubscribe();
  }
}
