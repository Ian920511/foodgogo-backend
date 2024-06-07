const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const userServices = {
  getUserByEmail: async (email) => {
    const user = await prisma.user.findFirst({
      where: { email },
      include: {
        cart: {
          select: { id: true }
        }
      }
    })

    return user
  },

  createUser: async (email, username, password, tel, address) => {
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: await bcrypt.hash(password, 10),
        tel,
        address,
        cart: {
          create: {}
        }
      }
    })

    return user
  }
}