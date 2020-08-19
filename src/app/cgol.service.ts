//the service should basically replace all DOM elements 
// replace element manip w/ ngIfs etc in controlcenter.html

import { Subject } from "rxjs";

export class CgolService {
  boardSize: number;
  boardSizeSub = new Subject<any[][]>();  //emits new board size
  boardHtmlTableRowsArray: any[][];
  boardHtml: any[];
  private boardHtmlSize: number; //is length of one side (ie square root of boardHTML array length - dependent on square board)
  private boardHtmlTotalLength: number; //total length of boardHTML single array


  //arrayStuff;
  
  timerEnabled = false;
  makeTurn = new Subject();


  cgolBoardInit(boardSize: number) {

    this.boardHtmlSize = boardSize;
    this.boardHtmlTotalLength = boardSize * boardSize;
    
    this.boardHtmlTableRowsArray = new Array(boardSize);
    for (let i = 0; i < boardSize; i++) {
      this.boardHtmlTableRowsArray[i] = new Array(boardSize).fill("-");
    }
    this.boardSizeSub.next(this.getBoardArrayNested());
    return this.getBoardArrayNested();
  }

  getBoardArrayNested() {
    return this.boardHtmlTableRowsArray.slice();
  }
  
}
