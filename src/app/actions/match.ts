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
