'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createMatch(formData: FormData) {
  const gameId = Number(formData.get('gameId'))
  const participantsData = JSON.parse(formData.get('participants') as string)

  await prisma.match.create({
    data: {
      gameId,
      participants: {
        create: participantsData.map((p: any) => ({
          userId: Number(p.userId),
          score: Number(p.score),
          isWinner: Boolean(p.isWinner)
        }))
      }
    }
  })

  revalidatePath('/')
  redirect('/')
}

export async function createMatchWithNames(gameId: number, playerXName: string, playerOName: string, winner: 'X' | 'O' | 'Draw') {
  // 1. Find or create User X
  const userX = await prisma.user.upsert({
    where: { username: playerXName },
    update: {},
    create: { username: playerXName }
  })

  // 2. Find or create User O
  const userO = await prisma.user.upsert({
    where: { username: playerOName },
    update: {},
    create: { username: playerOName }
  })

  // 3. Create the Match
  await prisma.match.create({
    data: {
      gameId,
      status: 'completed',
      participants: {
        create: [
          {
            userId: userX.id,
            score: winner === 'X' ? 1 : 0,
            isWinner: winner === 'X'
          },
          {
            userId: userO.id,
            score: winner === 'O' ? 1 : 0,
            isWinner: winner === 'O'
          }
        ]
      }
    }
  })

  revalidatePath('/')
  redirect('/')
}
