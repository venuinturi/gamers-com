import prisma from '@/lib/prisma';
import TicTacToeLobby from '@/components/TicTacToeLobby';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default async function TicTacToePage() {
  const game = await prisma.game.findUnique({
    where: { name: 'Tic-Tac-Toe' }
  });

  if (!game) {
    return (
      <div className="p-8 text-center space-y-4">
        <div className="text-red-500 font-bold">Game not initialized!</div>
        <p>Please run the database seed script to continue.</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 min-h-screen">
      <header className="space-y-2">
        <Link href="/" className="flex items-center gap-1 text-muted-foreground hover:text-foreground w-fit transition-colors">
          <ChevronLeft size={16} />
          Back to Dashboard
        </Link>
        <h1 className="text-5xl font-black tracking-tighter text-blue-600">TIC-TAC-TOE</h1>
        <p className="text-muted-foreground text-lg">Challenge your friends to an online match.</p>
      </header>

      <TicTacToeLobby />
    </div>
  );
}
