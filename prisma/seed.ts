import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create Users
  const alice = await prisma.user.upsert({
    where: { username: 'Alice' },
    update: {},
    create: { username: 'Alice' },
  })

  const bob = await prisma.user.upsert({
    where: { username: 'Bob' },
    update: {},
    create: { username: 'Bob' },
  })

  const charlie = await prisma.user.upsert({
    where: { username: 'Charlie' },
    update: {},
    create: { username: 'Charlie' },
  })

  // Create Games
  const chess = await prisma.game.upsert({
    where: { name: 'Chess' },
    update: {},
    create: { name: 'Chess', description: 'A classic strategy game.' },
  })

  const ticTacToe = await prisma.game.upsert({
    where: { name: 'Tic-Tac-Toe' },
    update: {},
    create: { name: 'Tic-Tac-Toe', description: 'A simple game for two.' },
  })

  // Create some Matches
  const match1 = await prisma.match.create({
    data: {
      gameId: chess.id,
      participants: {
        create: [
          { userId: alice.id, score: 1, isWinner: true },
          { userId: bob.id, score: 0, isWinner: false },
        ],
      },
    },
  })

  const match2 = await prisma.match.create({
    data: {
      gameId: ticTacToe.id,
      participants: {
        create: [
          { userId: bob.id, score: 1, isWinner: true },
          { userId: charlie.id, score: 0, isWinner: false },
        ],
      },
    },
  })

  console.log('Seeding complete!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
