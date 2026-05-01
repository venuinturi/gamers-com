import prisma from '@/lib/prisma';
import NewMatchForm from '@/components/NewMatchForm';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default async function NewMatchPage() {
  const users = await prisma.user.findMany();
  const games = await prisma.game.findMany();

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-8">
      <header className="space-y-2">
        <Link href="/" className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
          <ChevronLeft size={16} />
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold">Record a New Match</h1>
      </header>

      <NewMatchForm users={users} games={games} />
    </div>
  );
}
