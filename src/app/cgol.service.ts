import { Subject } from "rxjs";

export class CgolService {

  private boardArrays: boolean[][];
  boardArraysSub = new Subject<boolean[][]>();  //emits new board size
  private _boardSize: number;            //is length of one side
  private _boardHtmlTotalLength: number; //total length of boardHTML as single array

  timerEnabled =  new Subject<boolean>();
  timerTimeRemaining = new Subject<string>();
  timerDefaultTime = 30000;
  //used to set & clear timeout references:
  private timerReferencesObject = {   
    timerOverallTimeout: null,
    timerTurnInterval: null,   
    timerTimeRemainingEachSecond: 30
  }

  //Init & New BoardSize Section:
  cgolBoardInit(boardSize: number) {
    
    const boardArraysTemporary = this.copyOldMarksIntoNewBoard(boardSize);
    //set (or reset) internal variables:
    this._boardSize = boardSize;
    this._boardHtmlTotalLength = boardSize * boardSize;
    this.boardArrays = boardArraysTemporary.slice();
    this.boardArraysSub.next(this.getBoardArrayNested());
  }

  private copyOldMarksIntoNewBoard(boardSize: number) {

    const boardArraysTemporary = new Array(boardSize);
    for (let i = 0; i < boardSize; i++) {
      boardArraysTemporary[i] = new Array(boardSize).fill(false);
    }
    // case of changed boardSize ... preserve selected squares/marks
    if (this.boardArrays) {

      const oldMarksObject = this.translateOldMarksIndicesToNewBoardSize(this._boardSize, boardSize);
      let startingIndex;
      let endingIndex;
      //new board is larger
      if (this._boardSize < boardSize) {

        startingIndex = oldMarksObject.startIndex;
        endingIndex = oldMarksObject.startIndex + this._boardSize;
      }
      //new board is smaller
      else {

        startingIndex = 0;
        endingIndex = boardSize;
      }
      //copy old squares/marks into new board
      let singleArrayIndex = 0;
      for (let i = startingIndex; i < endingIndex; i++) {
        for (let j = startingIndex; j < endingIndex; j++) {

          boardArraysTemporary[i][j] = oldMarksObject.toBeCopiedMarksArray[singleArrayIndex];
          singleArrayIndex++;
        }
      }
    }
    return boardArraysTemporary;
  }

  private translateOldMarksIndicesToNewBoardSize(oldBoardSize: number, newBoardSize: number) {

    let toBeCopiedMarksArray,
        startIndicesForFirstSquare;

    //small board to larger case
    if (newBoardSize > oldBoardSize) {

      if (newBoardSize - oldBoardSize === 1) {
        //offsets to bottom right corner, instead of top left, if board is next size up
        startIndicesForFirstSquare = 1;
      }
      else {
        startIndicesForFirstSquare = Math.floor((newBoardSize - oldBoardSize) / 2);
      }
      toBeCopiedMarksArray = new Array(oldBoardSize * oldBoardSize);
      this.boardArrays.forEach((row, rowIndex) => {
        row.forEach((square, squareIndex) => {

          const currSingleLineIndex = squareIndex + rowIndex * oldBoardSize;
          toBeCopiedMarksArray[currSingleLineIndex] = square;
        });
      });
    }
    //large board to smaller case
    else {

      startIndicesForFirstSquare = Math.floor((oldBoardSize - newBoardSize) / 2);
      let endingIndex = startIndicesForFirstSquare + newBoardSize;
      toBeCopiedMarksArray = new Array(newBoardSize * newBoardSize);

      let singleArrayIndex = 0;

      for (let i = startIndicesForFirstSquare; i < endingIndex; i++) {
        for (let j = startIndicesForFirstSquare; j < endingIndex; j++) {
          
          toBeCopiedMarksArray[singleArrayIndex] = this.boardArrays[i][j];
          singleArrayIndex++;
        }
      }
    }

    return {
      toBeCopiedMarksArray: toBeCopiedMarksArray,
      startIndex: startIndicesForFirstSquare
    };
  }
 
  //Turns & Marks Section:
  makeTurn() {
    
    const boardArraysNextState = new Array(this.boardSize);
    for (let i = 0; i < this.boardSize; i++) {

      boardArraysNextState[i] = new Array(this.boardSize).fill(false);
    }

    this.boardArrays.forEach((row, rowIndex) => {
      row.forEach((square, squareIndex)=> {

        let totNeighborsAlive = this.countTotNeighbors(rowIndex, +squareIndex);
        //Evaluate neighbor count to determine if cell lives or die:
        //case: if alive already
        if (square) {
          //2 or 3 neghibors = survives
          if (totNeighborsAlive < 2 || totNeighborsAlive > 3) boardArraysNextState[rowIndex][squareIndex] = false;
          else boardArraysNextState[rowIndex][squareIndex] = true;
        }
        //case: dead cell
        else {
    
          if (totNeighborsAlive === 3) boardArraysNextState[rowIndex][squareIndex] = true;
          else boardArraysNextState[rowIndex][squareIndex] = false;
          }
      })
    });

    this.boardArrays = boardArraysNextState;
    this.boardArraysSub.next(this.getBoardArrayNested());
  }

  private countTotNeighbors(rowIndex: number, squareIndex: number) {

    let totNeighborsAlive = 0;      
    let rowEnd, 
        rowStart,
        squareIdxQuantity, 
        squareStart;

    //check for edge column cases
    if (squareIndex === 0) {
      squareIdxQuantity = 2;
      squareStart = squareIndex;
    }
    else if (squareIndex === (this.boardSize - 1)) {
      squareIdxQuantity = 2;
      squareStart = squareIndex - 1;
    }
    else {
      squareIdxQuantity = 3;
      squareStart = squareIndex - 1;
    }
    //check for edge row cases
    if (rowIndex === 0) {
      rowStart = 0;
      rowEnd = rowIndex + 1;
    }
    else if (rowIndex === this.boardSize - 1) {
      rowStart = rowIndex - 1;
      rowEnd = rowIndex;
    }
    else {
      rowStart = rowIndex - 1;
      rowEnd = rowIndex + 1;
    }

    const that = this;
    countNeighborsInRowsRecursively(rowStart, squareStart);

    function countNeighborsInRowsRecursively(currentRow, startingSquare) {

      if (currentRow <= rowEnd) {
        //check if cell alive in each row
        for (let i = startingSquare; i < squareIdxQuantity + startingSquare; i++) {
          //check that we're not on original square/cell
          if (!(currentRow === rowIndex && i === squareIndex)) {
            //check if square is true, if so that's a neighbor
            if(that.boardArrays[currentRow][i]) {
              totNeighborsAlive++;
            }
          }
        }
        countNeighborsInRowsRecursively(++currentRow, startingSquare);
      }
      else {
        return;
      }
    }

    return totNeighborsAlive;
  } 

  makeMark(row: number, square: number, randoEnabled?: boolean) {
    //stops random marks from turning off other random marks
    if (randoEnabled) {
      this.boardArrays[row][square] = true;
    }
    else {
      this.boardArrays[row][square] = !this.boardArrays[row][square];
      this.boardArraysSub.next(this.getBoardArrayNested());
    }
  }

  makeMarkRandom(markCount: number) {
    //delete all current marks
    this.clearAllMarks();
    for (let count = 0; count < markCount; count++) {

      const randoMarkRow = Math.floor(Math.random() * this.boardSize);
      const randoMarkSquare = Math.floor(Math.random() * this.boardSize);

      this.makeMark(randoMarkRow, randoMarkSquare);
    }
    this.boardArraysSub.next(this.getBoardArrayNested());
  }

  clearAllMarks() {

    this.boardArrays.forEach(row => {
      row.fill(false);
    });
  }

  //Timer Section:
  startAutoTimer() {
    //add updating seconds remaining count!!
    let duration = this.timerDefaultTime;
    this.timerEnabled.next(true);
    this.timerTimeRemaining.next(String(this.timerDefaultTime / 1000));

    //set overall timer length
    this.timerReferencesObject.timerOverallTimeout = window.setTimeout(() => {

      this.timerEnabled.next(false);
      this.clearTimerReferencesObject();
    }, duration);

    //set interval for making turns
    const makeTurnRateMS = 400;
    this.timerReferencesObject.timerTurnInterval = window.setInterval(() => {
      this.makeTurn();
    }, makeTurnRateMS);

    //set second timer to update string & clock features
    this.timerReferencesObject.timerTimeRemainingEachSecond = window.setInterval(() => {

      duration -= 1000;
      const durationLeftString = String(duration / 1000);
      this.timerTimeRemaining.next(durationLeftString);
    }, 1000);
  }

  stopAutoTimer() {
    
    this.timerEnabled.next(false);
    this.clearTimerReferencesObject();
  }

  private clearTimerReferencesObject() {

    clearTimeout(this.timerReferencesObject.timerOverallTimeout);
    clearInterval(this.timerReferencesObject.timerTurnInterval);
    clearInterval(this.timerReferencesObject.timerTimeRemainingEachSecond);
  }

  //Getters Section:
  getBoardArrayNested() {

    const slicedArray = new Array(this.boardSize);
    for (let i = 0; i < this.boardArrays.length; i++) {
      slicedArray[i] = this.boardArrays[i].slice(0);
    }
    return slicedArray;
  }

  get boardSize() {
    return this._boardSize;
  }
  
}
