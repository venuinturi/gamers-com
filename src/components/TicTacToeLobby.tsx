'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TicTacToeLobby() {
  const [roomCode, setRoomCode] = useState('');
  const [username, setUsername] = useState('');
  const router = useRouter();

  const generateRoomCode = () => {
    return Math.random().toString(36).substring(2, 6).toUpperCase();
  };

  const handleCreateRoom = () => {
    if (!username) return alert('Please enter your name');
    const newCode = generateRoomCode();
    // Redirect to the game room as Player X
    router.push(`/games/tic-tac-toe/room/${newCode}?user=${username}&role=X`);
  };

  const handleJoinRoom = () => {
    if (!username || !roomCode) return alert('Please enter your name and room code');
    // Redirect to the game room as Player O
    router.push(`/games/tic-tac-toe/room/${roomCode.toUpperCase()}?user=${username}&role=O`);
  };

  return (
    <div className="max-w-md mx-auto space-y-8 bg-card p-8 rounded-2xl border shadow-xl">
      <div className="space-y-2 text-center">
        <h2 className="text-3xl font-bold">Multiplayer Lobby</h2>
        <p className="text-muted-foreground">Play with friends across the internet</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Your Name</label>
          <input 
            type="text"
            placeholder="e.g. Alex"
            className="w-full p-3 rounded-lg border bg-background text-lg"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="pt-4 border-t space-y-6">
          <button 
            onClick={handleCreateRoom}
            className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-all shadow-lg active:scale-95"
          >
            Create New Room
          </button>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t"></div>
            <span className="flex-shrink mx-4 text-muted-foreground text-sm uppercase tracking-widest font-semibold">OR</span>
            <div className="flex-grow border-t"></div>
          </div>

          <div className="space-y-3">
            <input 
              type="text"
              placeholder="Enter 4-digit Code"
              className="w-full p-3 rounded-lg border bg-background text-center text-2xl font-mono uppercase tracking-widest"
              maxLength={4}
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
            />
            <button 
              onClick={handleJoinRoom}
              className="w-full border-2 border-blue-600 text-blue-600 font-bold py-3 rounded-xl hover:bg-blue-50 transition-all active:scale-95"
            >
              Join Existing Room
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
