import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

import { CgolService } from '../cgol.service';


@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

  boardHtml: any[][];
  currentlySelected: boolean = false;
  boardSubscription: Subscription
  //private boardHtml: any[];
  private boardHtmlSize: number; //is length of one side (ie square root of boardHTML array length - dependent on square board)
  private boardHtmlTotalLength: number; //total length of boardHTML single array


  constructor(private cgolService: CgolService) { }

  ngOnInit() {
    this.cgolService.boardSize = 5;
    //this.boardHtml = this.cgolService.cgolBoardInit(5);  //slice it first
    this.boardSubscription = this.cgolService.boardSizeSub.subscribe((arrayNested: any[][]) => {
      this.boardHtml = arrayNested;
    });
    this.boardHtml = this.cgolService.cgolBoardInit(3);
  }

  onClick(row: number, square: number) {
    console.log(row + ' ' + square);
    console.log(this.currentlySelected);
    const stringID = row + ' ' + square;
    this.boardHtml[row][square] = 'X';
    console.log(this.boardHtml);
    //@ViewChild(stringID, {static: false}) currentSquare; 
  }

  //creats board - square only for now
  /*cgolBoardInit(boardSize) {
    const boardAsSingleArray = new Array(boardSize * boardSize);
      boardAsSingleArray.fill("-");

      this.boardHtml = boardAsSingleArray;
      this.boardHtmlSize = boardSize;
      this.boardHtmlTotalLength = this.boardHtml.length;

      //this.createHtmlBoardElements.call(this, boardSize);
  } */

  checkToStyle(row: number, square: number) {
    if (this.boardHtml[row][square] === 'X') {
      return {
        'background-color': 'yellow'
      }
    }
    return {
      'background-color': 'coral'
    }
  }


}
