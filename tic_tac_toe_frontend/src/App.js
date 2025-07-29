import React, { useState, useEffect } from 'react';
import './App.css';

/**
 * PUBLIC_INTERFACE
 * The main App component for the Tic Tac Toe game.
 * - Provides 2-player functionality
 * - Responsive and minimalistic UI using project theme/colors
 * - Displays current player, win/draw status, and reset control
 */
function App() {
  // Board is array[9] with 'X', 'O', or null
  const [board, setBoard] = useState(Array(9).fill(null));
  // 'X' always starts
  const [xIsNext, setXIsNext] = useState(true);
  // Set winner: 'X', 'O', or null for ongoing
  const [winner, setWinner] = useState(null);
  // True for draw state
  const [draw, setDraw] = useState(false);

  // Apply the default theme (light/dark switch provided in base)
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');
  }, []);

  // Check for game outcome after every move
  useEffect(() => {
    const gameWinner = calculateWinner(board);
    setWinner(gameWinner);
    if (!gameWinner && board.every(Boolean)) {
      setDraw(true);
    } else {
      setDraw(false);
    }
  }, [board]);

  // PUBLIC_INTERFACE
  const handleSquareClick = (idx) => {
    if (board[idx] || winner) return; // No move if occupied or game over
    const nextBoard = board.slice();
    nextBoard[idx] = xIsNext ? 'X' : 'O';
    setBoard(nextBoard);
    setXIsNext(!xIsNext);
  };

  // PUBLIC_INTERFACE
  const handleReset = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setDraw(false);
    setXIsNext(true);
  };

  // Render square with markers
  function renderSquare(idx) {
    return (
      <button
        className="ttt-square"
        onClick={() => handleSquareClick(idx)}
        aria-label={`Square ${idx+1}${board[idx] ? ', taken by ' + board[idx] : ''}`}
        disabled={!!board[idx] || !!winner}
      >
        {board[idx]}
      </button>
    );
  }

  // Status message (next turn, win or draw)
  let statusMsg = '';
  if (winner) {
    statusMsg = `Winner: ${winner}`;
  } else if (draw) {
    statusMsg = 'Draw!';
  } else {
    statusMsg = `Next: ${xIsNext ? 'X' : 'O'}`;
  }

  return (
    <div className="App">
      <main className="ttt-container">
        <h1 className="ttt-title">Tic Tac Toe</h1>
        <div className="ttt-status" data-outcome={winner ? "win" : draw ? "draw" : "playing"}>
          {statusMsg}
        </div>
        <div className="ttt-board" role="grid" aria-label="Tic Tac Toe Board">
          {[0,1,2].map(row =>
            <div className="ttt-board-row" key={row}>
              {renderSquare(row*3)}
              {renderSquare(row*3+1)}
              {renderSquare(row*3+2)}
            </div>
          )}
        </div>
        <button className="ttt-reset-btn" onClick={handleReset}>Reset Game</button>
        <footer className="ttt-footer">
          <span className="ttt-credit">
            Modern Retro React • <span style={{ color: "#FF0099" }}>✦</span> 80s Glow Edition <span role="img" aria-label="game">🎮</span>
          </span>
        </footer>
      </main>
    </div>
  );
}

// PUBLIC_INTERFACE
/**
 * Determines the winner in a board state.
 * @param {Array} squares - Array of 9 values.
 * @returns {'X'|'O'|null}
 */
function calculateWinner(squares) {
  // All possible winning combinations (rows, columns, diagonals)
  const lines = [
    [0,1,2],[3,4,5],[6,7,8], // rows
    [0,3,6],[1,4,7],[2,5,8], // cols
    [0,4,8],[2,4,6],         // diagonals
  ];
  for (let line of lines) {
    const [a,b,c] = line;
    if (squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

export default App;
