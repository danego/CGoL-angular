# Conway's Game of Life (CGoL) in Angular # 

## Motivation / Background ##

The purpose of this project is to create, from scratch, a simulator of Conway's Game of Life, i.e., a board/grid of cells where each cell is either alive or dead and where each cell's state is evaluated after each turn based on these simple rules:

1. Any live cell with exactly 2 or 3 neighbors survives.
2. Any dead cell with exactly 3 neighbors becomes a live cell.
3. _All other_ cells die or stay dead in next generation.

***

## Angular Features ##

The app takes advantage of many Angular features, which help provide a robust and detailed operation. 
* The overall app is split into several Components (landing page, board, buttons, and stopwatch). For example, the board component handles the visuals and HTML of the actual grid.

* The connection between the control center buttons and the board itself is managed by a Service. The service ensures a smooth, predictable set of actions between the two (as well as convenient Subjects / Event Emitters to handle asynchronous code). 

* When the user returns to the app, their button preferences are restored with the help of a Reactive Form and the localStorage. 

* If it is the user's first visit, the program selects the correct timer duration and board size from the Environments folder. This is a convenient place to change such preferences.

* The custom Directives provide in-sync color features, expected clicking behavior, and dynamic table sizing.

* Much of the control center's functionality and visual look was achieved with the tools of Angular Material. In addition to the button and inputs styling, Material provided the foundation for the drag and drop feature of the stopwatch. 

***
## Code Structure and Style Guide ##

## How to Use ##

* The Cgol project is internally designed around a 2D nested array representation of the board. 

* Once the board size and timer duration are established, the cgolService takes over. 

* After that the user can control the state of the board either through the control center buttons or through the board itself by clicking on individual squares. 

* When the user changes the board size, the current marks are preserved as best as possible and translated to the new board size. 

* In addition to changing the board, the user has the ability to adjust the timer and its length using an intuitive system of dropping the hourglass icon at the desired location around the watch face.

* The overall visual style of the app is designed to be responsive to many screen sizes and the CSS files are designed mobile-first.

***

## CgolService Methods Available ##

- **cgolBoardInit(boardSize: number)**
  
  Initializes the board arrays and sets size of board (input of 5 creates a 5x5 board). Calls a chain of private methods to copy marks from previous board size (if existing) to new size.

- **makeTurn()**

  Advances state of the board to the next turn; evaluates each cell and its surrounding neighbors and determines if that cell lives or dies. Stores the resulting board in a temporary array and then sets the main internal board nested array equal to the result. 

  The number of neighbors is summed row by row: first the row above the current cell; then the row the current cell sits on (only up to two neighbors); and then the row beneath it. To account for edge-cases, makeTurn splits this proccess up in to three parts.

  1. countTotNeighbors()
      - For given cell index, sets start and stop indices for forLoops in next function depending on if the index cell is in: interior, edge column case, edge row case
      - starts recursive function 
      - returns total number of neighbors alive for that cell
  2. countNeighborsInRowsRecursively(currentRow, startingSquare)
      - runs for each row and increments total neighbors alive for each cell alive in that row
      - calls itself again for each new row
      - once it reaches row beneath current cell, it returns the number of neighbors alive
  3. makeTurn() 
      - Takes the resulting number of neighbors and determines if the cell should live or die based on the CGoL rules and whether the cell is currently alive or dead.  
      - Repeats and calls the previous two functions for every cell in board

- **makeMark(row: number, square: number, randoEnabled?: boolean)**

  Takes an index (row and square number) and flips the state of that cell, i.e., from alive to dead. If randoEnabled argument is passed in, then makeMark does not flip the cell's state but sets it to alive. This creates a truer random density of marks at higher levels (otherwise the random marks "turn off" other random marks).

- **makeMarkRandom(markCount: number)**

  Creates inputted markCount number of random marks on board. Clears board first. 

- **clearAllMarks()**

  Sets all cells to dead state regardless of current cell condition.

- **startAutoTimer(timerDefaultTime)**

  Creates intervals for overall time, turn rate, and seconds (for stopwatch). Informs other components of start. 

- **stopAutoTimer()**

  Clears all timer references and informs other components of stop.

- **getBoardArrayNested()**

  Currently performs a shallow copy of the nested arrays representing the board in order to increase app speed. Can be switched to perform a deep copy (no preserved references).


***

 
## Angular Running Notes ##

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.0.1.

## Development server ##

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build ##

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

