'use client'

import { createMatch } from '@/app/actions/match';
import { User, Game } from '@prisma/client';

export default function NewMatchForm({ users, games }: { users: User[], games: Game[] }) {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const p1 = formData.get('player1') as string;
    const p2 = formData.get('player2') as string;
    const w1 = formData.get('winner1') === 'on';
    const w2 = formData.get('winner2') === 'on';

    const participants = [
      { userId: p1, score: w1 ? 1 : 0, isWinner: w1 },
      { userId: p2, score: w2 ? 1 : 0, isWinner: w2 }
    ];

    formData.set('participants', JSON.stringify(participants));
    await createMatch(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 rounded-xl border shadow-sm text-foreground">
      <div className="space-y-2">
        <label className="text-sm font-medium">Select Game</label>
        <select 
          name="gameId" 
          required
          className="w-full p-2 rounded-md border bg-background"
        >
          {games.map(game => (
            <option key={game.id} value={game.id}>{game.name}</option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium text-lg">Participants</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2 p-4 border rounded-lg">
            <label className="text-sm font-medium">Player 1</label>
            <select name="player1" className="w-full p-2 rounded-md border bg-background">
              {users.map(user => (
                <option key={user.id} value={user.id}>{user.username}</option>
              ))}
            </select>
            <div className="flex items-center gap-2 pt-2">
              <input type="checkbox" name="winner1" id="winner1" />
              <label htmlFor="winner1" className="text-sm">Winner?</label>
            </div>
          </div>

          <div className="space-y-2 p-4 border rounded-lg">
            <label className="text-sm font-medium">Player 2</label>
            <select name="player2" className="w-full p-2 rounded-md border bg-background">
              {users.map(user => (
                <option key={user.id} value={user.id}>{user.username}</option>
              ))}
            </select>
            <div className="flex items-center gap-2 pt-2">
              <input type="checkbox" name="winner2" id="winner2" />
              <label htmlFor="winner2" className="text-sm">Winner?</label>
            </div>
          </div>
        </div>
      </div>

      <button 
        type="submit"
        className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Save Match
      </button>
    </form>
  );
}
