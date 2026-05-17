import prisma from '@/lib/prisma';
import OnlineTicTacToe from '@/components/OnlineTicTacToe';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { notFound } from 'next/navigation';

export default async function GameRoomPage({
  params,
  searchParams
}: {
  params: Promise<{ roomCode: string }>,
  searchParams: Promise<{ user?: string, role?: string }>
}) {
  const { roomCode } = await params;
  const { user, role } = await searchParams;

  if (!user || !role || (role !== 'X' && role !== 'O')) {
    return notFound();
  }

  const game = await prisma.game.findUnique({
    where: { name: 'Tic-Tac-Toe' }
  });

  if (!game) return <div>Game not found</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 min-h-screen">
      <header className="space-y-2">
        <Link href="/games/tic-tac-toe" className="flex items-center gap-1 text-muted-foreground hover:text-foreground w-fit transition-colors">
          <ChevronLeft size={16} />
          Exit Room
        </Link>
        <h1 className="text-4xl font-black tracking-tight">Game Room</h1>
      </header>

      <OnlineTicTacToe 
        roomCode={roomCode}
        username={user}
        role={role as 'X' | 'O'}
        gameId={game.id}
      />
    </div>
  );
}
