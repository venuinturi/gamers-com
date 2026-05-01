'use client'

import { useState } from 'react';
import { User } from '@prisma/client';
import { createMatch } from '@/app/actions/match';

export default function TicTacToe({ users, gameId }: { users: User[], gameId: number }) {
  const [playerX, setPlayerX] = useState<string>('');
  const [playerO, setPlayerO] = useState<string>('');
  const [gameStarted, setGameStarted] = useState(false);
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const calculateWinner = (squares: (string | null)[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6]             // diagonals
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return squares.includes(null) ? null : 'Draw';
  };

  const winner = calculateWinner(board);
  const status = winner 
    ? winner === 'Draw' ? "It's a Draw!" : `Winner: ${winner === 'X' ? users.find(u => u.id.toString() === playerX)?.username : users.find(u => u.id.toString() === playerO)?.username}`
    : `Next player: ${xIsNext ? 'X' : 'O'} (${xIsNext ? users.find(u => u.id.toString() === playerX)?.username : users.find(u => u.id.toString() === playerO)?.username})`;

  const handleClick = (i: number) => {
    if (winner || board[i]) return;
    const newBoard = board.slice();
    newBoard[i] = xIsNext ? 'X' : 'O';
    setBoard(newBoard);
    setXIsNext(!xIsNext);
  };

  const handleSaveResult = async () => {
    setSubmitting(true);
    const formData = new FormData();
    formData.set('gameId', gameId.toString());

    const participants = [
      { 
        userId: playerX, 
        score: winner === 'X' ? 1 : 0, 
        isWinner: winner === 'X' 
      },
      { 
        userId: playerO, 
        score: winner === 'O' ? 1 : 0, 
        isWinner: winner === 'O' 
      }
    ];

    formData.set('participants', JSON.stringify(participants));
    await createMatch(formData);
  };

  if (!gameStarted) {
    return (
      <div className="bg-card p-8 rounded-xl border shadow-lg max-w-md mx-auto space-y-6">
        <h2 className="text-2xl font-bold text-center">New Tic-Tac-Toe Game</h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Player X</label>
            <select 
              className="w-full p-2 rounded-md border bg-background"
              value={playerX}
              onChange={(e) => setPlayerX(e.target.value)}
            >
              <option value="">Select Friend</option>
              {users.map(u => <option key={u.id} value={u.id}>{u.username}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Player O</label>
            <select 
              className="w-full p-2 rounded-md border bg-background"
              value={playerO}
              onChange={(e) => setPlayerO(e.target.value)}
            >
              <option value="">Select Friend</option>
              {users.map(u => <option key={u.id} value={u.id}>{u.username}</option>)}
            </select>
          </div>
          <button 
            disabled={!playerX || !playerO || playerX === playerO}
            onClick={() => setGameStarted(true)}
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all"
          >
            Start Game
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-8">
      <div className="text-center space-y-2">
        <div className={`text-2xl font-bold ${winner ? 'text-green-600 animate-bounce' : ''}`}>
          {status}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 bg-muted p-3 rounded-xl shadow-inner">
        {board.map((square, i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            className="w-24 h-24 bg-background rounded-lg text-4xl font-black flex items-center justify-center shadow-md hover:bg-muted/50 transition-colors"
          >
            <span className={square === 'X' ? 'text-blue-500' : 'text-red-500'}>
              {square}
            </span>
          </button>
        ))}
      </div>

      {winner && (
        <div className="space-y-4 w-full max-w-xs">
          <button
            onClick={handleSaveResult}
            disabled={submitting}
            className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-all shadow-lg flex items-center justify-center gap-2"
          >
            {submitting ? 'Saving...' : 'Save Result & Record Win'}
          </button>
          <button
            onClick={() => {
              setBoard(Array(9).fill(null));
              setXIsNext(true);
            }}
            className="w-full border border-muted-foreground py-2 rounded-lg hover:bg-muted transition-colors"
          >
            Rematch
          </button>
        </div>
      )}
    </div>
  );
}
