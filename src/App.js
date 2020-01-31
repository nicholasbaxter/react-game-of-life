import React, { useState, useCallback, useRef } from "react";
import produce from "immer";
import Slider from "react-input-slider";
import Footer from "./components/Footer";
import "./App.css";

const numRows = 62;
const numCols = 62;

const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0]
];

const generateEmptyGrid = () => {
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => 0));
  }
  return rows;
};

const App = () => {
  const [mousePressed, setMousePressed] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [grid, setGrid] = useState(() => {
    return generateEmptyGrid();
  });
  const [running, setRunning] = useState(false);
  //To use the current value in a callback
  const runningRef = useRef();
  runningRef.current = running;

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }

    setGrid(g => {
      return produce(g, gridCopy => {
        for (let i = 0; i < numRows; i++) {
          for (let j = 0; j < numCols; j++) {
            let neighbours = 0;
            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newJ = j + y;
              if (newI >= 0 && newI < numRows && newJ >= 0 && newJ < numCols) {
                neighbours += g[newI][newJ];
              }
            });
            if (neighbours < 2 || neighbours > 3) {
              gridCopy[i][j] = 0;
            } else if (g[i][j] === 0 && neighbours === 3) {
              gridCopy[i][j] = 1;
            }
          }
        }
      });
    });

    setTimeout(runSimulation, speed);
  }, [speed]);

  return (
    <>
      <div style={{}}>
        <div
          style={{
            position: "fixed",
            right: "0px",
            top: "0px",
            textAlign: "center",
            backgroundColor: "rgba(255,255,255,0.3)",
            padding: "0.2rem 0.1rem 0.5rem 0.8rem",
            borderBottomLeftRadius: "20px"
          }}
        >
          <button
            onClick={() => {
              setRunning(!running);
              if (!running) {
                runningRef.current = true;
                runSimulation();
              }
            }}
          >
            {running ? "Stop" : "Start"}
          </button>
          <button
            onClick={() => {
              const rows = [];
              for (let i = 0; i < numRows; i++) {
                rows.push(
                  Array.from(Array(numCols), () =>
                    Math.random() > 0.7 ? 1 : 0
                  )
                );
              }
              setGrid(rows);
            }}
          >
            Random
          </button>
          <button
            onClick={() => {
              setGrid(generateEmptyGrid());
            }}
          >
            Clear
          </button>
          <div>
            <p style={{ color: "white" }}>Generation time: {speed}ms</p>
            <Slider
              xmax={1500}
              axis="x"
              x={speed}
              onChange={({ x }) => {
                setSpeed(x);
              }}
            />
          </div>
        </div>
        <div
          onMouseDown={() => setMousePressed(true)}
          onMouseUp={() => setMousePressed(false)}
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${numCols}, 14px)`,
            width: "100%",
            height: "100vh",
            justifyContent: "center",
            alignItems: "center",
            alignContent: "center"
          }}
        >
          {grid.map((rows, i) =>
            rows.map((col, k) => (
              <div
                key={`${i}-${k}`}
                onMouseDown={() => {
                  const newGrid = produce(grid, gridCopy => {
                    gridCopy[i][k] = grid[i][k] ? 0 : 1;
                  });
                  setGrid(newGrid);
                }}
                onMouseOver={() => {
                  if (mousePressed) {
                    const newGrid = produce(grid, gridCopy => {
                      gridCopy[i][k] = grid[i][k] ? 0 : 1;
                    });
                    setGrid(newGrid);
                  }
                }}
                style={{
                  width: "13px",
                  height: "13px",
                  backgroundColor: grid[i][k] ? "salmon" : undefined,
                  border: "solid 0.5px rgba(255,255,255,0.3)"
                }}
              />
            ))
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default App;
