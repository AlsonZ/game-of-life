import React, { useState, useCallback, useRef } from 'react';
import './App.css';

let numRows = 40;
let numCols = 50;

const neighbourOperations = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0],/*[0, 0],*/[1, 0],
  [-1, 1], [0, 1], [1, 1]
]

function App() {
  const [speed, setSpeed] = useState(100);
  const speedRef = useRef(speed);
  const [running, setRunning] = useState(false);
  const runningRef = useRef(running);
  runningRef.current = running;
  const createEmptyGrid = () => {
    return(Array(numRows).fill(Array(numCols).fill(0)));
  }
  const [grid, setGrid] = useState(() => createEmptyGrid());
  
  const randomGrid = () => {
    const rows = [];
    for (let i = 0; i< numRows; i++) {
      rows.push(
        Array.from(Array(numCols), () => (Math.random() > 0.7 ? 1 : 0))
      )
    }
    return rows;
  }

  const run = useCallback(() => {
    if(!runningRef.current) {
      return; // do nothing
    }

    setGrid((prevGrid) => {
      const newGrid = prevGrid.map((rows, x) => rows.map((col, y) => {
        let neighbours = 0;
        neighbourOperations.forEach(([modX, modY]) => {
          // use modX and modY to compute neighbour
          const newX = (x + modX + numRows) % numRows; // wrap around with modulo
          const newY = (y + modY + numCols) % numCols; // wrap around with modulo
          // check out of bounds
          if (newX >= 0 && newX < numRows && newY >= 0 && newY < numCols) {
            // not out of bounds
            neighbours += prevGrid[newX][newY]; // if =1 is alive so add 1 
          }
        });
        // rules
        if(neighbours < 2 || neighbours > 3) {
          // less than 2 neighbours and more than 3 neighbours dies
          return 0;
        } else if(col === 0 && neighbours === 3) {
          // if cell is dead and there are 3 neighbours gets born
          return 1;
        } else {
          return col;
        }
      }))
      return newGrid;
    })
    setTimeout(run, speedRef.current);
  }, [])
  
  
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
  return (
    <div className="app-container">
      <div style = {
        {
          margin: '1rem',
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
          />
        ))}
      </div>
      <div className="action-container">
        <button onClick={() => setGrid(() => randomGrid())}>Randomise</button>  
        <button onClick={() => setGrid(() => createEmptyGrid())}>Reset</button>  
        <button onClick={() => {
          setRunning(!running);
          runningRef.current = true;
          run();
        }}>
          {running ? 'Stop' : 'Start'}
        </button>  
        <input type="number" value={speed} onChange={event => setSpeed(event.target.value)}/>
        <button onClick={() => {speedRef.current = speed}}>Change Speed</button>
      </div>
    </div>
  );
}

export default App;
