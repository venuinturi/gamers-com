'use client'

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { createMatchWithNames } from '@/app/actions/match';
import { useRouter } from 'next/navigation';

interface OnlineGameProps {
  roomCode: string;
  username: string;
  role: 'X' | 'O';
  gameId: number;
}

export default function OnlineTicTacToe({ roomCode, username, role, gameId }: OnlineGameProps) {
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [opponent, setOpponent] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // 1. Subscribe to the Room Channel
    const channel = supabase.channel(`room:${roomCode}`, {
      config: { broadcast: { self: false } }
    });

    channel
      .on('broadcast', { event: 'move' }, (payload) => {
        setBoard(payload.payload.board);
        setXIsNext(payload.payload.xIsNext);
      })
      .on('broadcast', { event: 'join' }, (payload) => {
        setOpponent(payload.payload.username);
        // Reply back so the newcomer knows we are here
        channel.send({
          type: 'broadcast',
          event: 'welcome',
          payload: { username }
        });
      })
      .on('broadcast', { event: 'welcome' }, (payload) => {
        setOpponent(payload.payload.username);
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          // Notify others that we've joined
          channel.send({
            type: 'broadcast',
            event: 'join',
            payload: { username }
          });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomCode, username]);

  const calculateWinner = (squares: (string | null)[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
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
  const myTurn = (xIsNext && role === 'X') || (!xIsNext && role === 'O');

  const handleClick = (i: number) => {
    if (winner || board[i] || !myTurn || !opponent) return;

    const newBoard = board.slice();
    newBoard[i] = role;
    const nextTurn = !xIsNext;

    setBoard(newBoard);
    setXIsNext(nextTurn);

    // Broadcast the move to the opponent
    supabase.channel(`room:${roomCode}`).send({
      type: 'broadcast',
      event: 'move',
      payload: { board: newBoard, xIsNext: nextTurn }
    });
  };

  const handleSaveResult = async () => {
    setSubmitting(true);
    const playerXName = role === 'X' ? username : opponent!;
    const playerOName = role === 'O' ? username : opponent!;
    const winResult = winner as 'X' | 'O' | 'Draw';

    await createMatchWithNames(gameId, playerXName, playerOName, winResult);
    router.push('/');
  };

  return (
    <div className="flex flex-col items-center space-y-8 p-4">
      <div className="text-center space-y-4">
        <div className="bg-blue-100 text-blue-800 px-4 py-1 rounded-full text-sm font-mono font-bold tracking-widest border border-blue-200">
          ROOM CODE: {roomCode}
        </div>
        
        <div className="flex gap-8 justify-center items-center">
          <div className={`p-4 rounded-xl border ${xIsNext ? 'bg-blue-50 border-blue-200' : 'bg-background opacity-50'}`}>
            <div className="text-xs uppercase font-bold text-muted-foreground">Player X</div>
            <div className="text-lg font-bold">{role === 'X' ? `${username} (You)` : opponent || 'Waiting...'}</div>
          </div>
          <div className="text-2xl font-black text-muted-foreground">VS</div>
          <div className={`p-4 rounded-xl border ${!xIsNext ? 'bg-red-50 border-red-200' : 'bg-background opacity-50'}`}>
            <div className="text-xs uppercase font-bold text-muted-foreground">Player O</div>
            <div className="text-lg font-bold">{role === 'O' ? `${username} (You)` : opponent || 'Waiting...'}</div>
          </div>
        </div>
      </div>

      {!opponent && (
        <div className="animate-pulse flex items-center gap-2 text-blue-600 font-medium italic">
           Waiting for friend to join...
        </div>
      )}

      <div className={`grid grid-cols-3 gap-3 bg-muted p-3 rounded-2xl shadow-inner ${!myTurn && !winner ? 'opacity-70 grayscale' : ''}`}>
        {board.map((square, i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            disabled={!myTurn || !!winner || !opponent}
            className={`w-24 h-24 sm:w-32 sm:h-32 bg-background rounded-xl text-5xl font-black flex items-center justify-center shadow-lg transition-all 
              ${!board[i] && myTurn && opponent ? 'hover:bg-blue-50 hover:scale-95 active:bg-blue-100' : ''}
              ${board[i] ? 'cursor-default' : ''}`}
          >
            <span className={square === 'X' ? 'text-blue-500' : 'text-red-500'}>
              {square}
            </span>
          </button>
        ))}
      </div>

      <div className="h-12 flex items-center justify-center">
        {winner ? (
          <div className="text-2xl font-bold text-green-600 animate-bounce">
            {winner === 'Draw' ? "It's a Draw!" : `Winner: ${winner === 'X' ? (role === 'X' ? username : opponent) : (role === 'O' ? username : opponent)}`}
          </div>
        ) : opponent && (
          <div className={`text-xl font-semibold ${myTurn ? 'text-blue-600' : 'text-muted-foreground'}`}>
            {myTurn ? "Your Turn!" : "Waiting for opponent..."}
          </div>
        )}
      </div>

      {winner && (
        <div className="flex gap-4">
          <button
            onClick={handleSaveResult}
            disabled={submitting}
            className="bg-green-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-green-700 shadow-xl disabled:opacity-50"
          >
            {submitting ? 'Recording Match...' : 'Save & Exit'}
          </button>
        </div>
      )}
    </div>
  );
}
