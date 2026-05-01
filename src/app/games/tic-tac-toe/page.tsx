import prisma from '@/lib/prisma';
import TicTacToe from '@/components/TicTacToe';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default async function TicTacToePage() {
  const users = await prisma.user.findMany({
    orderBy: { username: 'asc' }
  });

  const game = await prisma.game.findUnique({
    where: { name: 'Tic-Tac-Toe' }
  });

  if (!game) {
    return <div>Game not found in database. Please seed the database.</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <header className="space-y-2">
        <Link href="/" className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
          <ChevronLeft size={16} />
          Back to Dashboard
        </Link>
        <h1 className="text-4xl font-extrabold tracking-tight">Tic-Tac-Toe</h1>
        <p className="text-muted-foreground">Play a quick match with a friend!</p>
      </header>

      <TicTacToe users={users} gameId={game.id} />
    </div>
  );
}
