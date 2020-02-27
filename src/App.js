import React, { useState } from 'react';
import './App.css';

let numRows = 50;
let numCols = 50;

const createEmptyGrid = () => {
  return(Array(numRows).fill(Array(numCols).fill(0)));
  // return(Array(numRows).fill().map(() => Array(numCols).fill(0)));
}


function App() {
  const clickCell = (markedX, markedY) => {
    setGrid((prevGrid) => {
      const newGrid = prevGrid.map((rows, x) => rows.map((col, y) => {
        if(markedX === x && markedY === y) {
          return (col = col ? 0: 1);
        } else {
          return col;
        }
      }))
      return newGrid;
    })    
  }
  const [grid, setGrid] = useState(createEmptyGrid());
  return (
    <div style = {
      {
        display: 'grid',
        gridTemplateColumns: `repeat(${numCols}, 20px)`
      }
    }>
      {grid.map((rows, x) => rows.map((col, y) => 
        <div 
          onClick = {() => {clickCell(x,y)}}
          key = {`${x}-${y}`}
          style = {
            {
              width: 20,
              height: 20,
              backgroundColor: grid[x][y] ? 'black' : undefined, // if =0 then is false because truthy/falsey
              border: "solid 1px blue"
            }
          }
        >

        </div>
      ))}
    </div>
  );
}

export default App;
