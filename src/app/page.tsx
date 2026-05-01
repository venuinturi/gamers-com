import prisma from '@/lib/prisma';
import { Trophy, Users, Gamepad2, Plus } from 'lucide-react';
import Link from 'next/link';

export default async function Dashboard() {
  const recentMatches = await prisma.match.findMany({
    take: 5,
    orderBy: { playedAt: 'desc' },
    include: {
      game: true,
      participants: {
        include: { user: true }
      }
    }
  });

  const users = await prisma.user.findMany({
    include: {
      matches: true
    }
  });

  const leaderboard = users.map(user => ({
    id: user.id,
    username: user.username,
    wins: user.matches.filter(m => m.isWinner).length,
    totalMatches: user.matches.length
  })).sort((a, b) => b.wins - a.wins);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Gamers Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, friend!</p>
        </div>
        <Link 
          href="/matches/new"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          New Match
        </Link>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stats Cards */}
        <div className="bg-card p-6 rounded-xl border shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-blue-500">
            <Trophy size={20} />
            <span className="font-medium">Total Matches</span>
          </div>
          <div className="text-3xl font-bold">{users.reduce((acc, u) => acc + u.matches.length, 0) / 2}</div>
        </div>
        <div className="bg-card p-6 rounded-xl border shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-green-500">
            <Users size={20} />
            <span className="font-medium">Friends</span>
          </div>
          <div className="text-3xl font-bold">{users.length}</div>
        </div>
        <div className="bg-card p-6 rounded-xl border shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-purple-500">
            <Gamepad2 size={20} />
            <span className="font-medium">Active Games</span>
          </div>
          <div className="text-3xl font-bold">{await prisma.game.count()}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Leaderboard */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Leaderboard</h2>
          <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-muted/50 text-muted-foreground text-sm">
                <tr>
                  <th className="px-6 py-3 font-medium">Player</th>
                  <th className="px-6 py-3 font-medium text-center">Wins</th>
                  <th className="px-6 py-3 font-medium text-center">Matches</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {leaderboard.map((player) => (
                  <tr key={player.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4 font-medium">{player.username}</td>
                    <td className="px-6 py-4 text-center">{player.wins}</td>
                    <td className="px-6 py-4 text-center text-muted-foreground">{player.totalMatches}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Recent Matches */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Recent Matches</h2>
          <div className="space-y-3">
            {recentMatches.map((match) => (
              <div key={match.id} className="bg-card p-4 rounded-xl border shadow-sm flex justify-between items-center">
                <div>
                  <div className="font-semibold text-lg">{match.game.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(match.playedAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {match.participants.map((p, idx) => (
                    <span key={p.userId} className="flex items-center gap-1">
                      <span className={p.isWinner ? "font-bold text-green-600" : "text-muted-foreground"}>
                        {p.user.username}
                      </span>
                      {idx < match.participants.length - 1 && <span className="text-muted-foreground">vs</span>}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
