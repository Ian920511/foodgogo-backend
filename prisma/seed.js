const bcrypt = require('bcryptjs')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const productSeed = require('./seeds/productseed.json')

async function main () {
  await prisma.$transaction(async(tx) => {
    const admin = await tx.user.create({
      data: {
        username: "admin",
        email: "admin@gmail.com",
        password: bcrypt.hashSync('123456', 10),
        address: "台北",
        tel: "09123456789",
        isAdmin: true
      }
    })

    await tx.category.createMany({
      data: [{ name: "飲料"}, { name: "美式"}, { name: "中式"}, { name: "日式"}]
    })

    const categories = await tx.category.findMany()

    await tx.product.createMany({
      data: productSeed.map((product) => ({
        name: product.name,
        description: product.description,
        image: product.image,
        price: product.price,
        active: product.active,
        categoryId: categories.find(
          (category) => category.name === product.category
        ).id
      }))
    })

    const user1 = await tx.user.create({
      data: {
        username: "user1",
        email: "user1@gmail.com",
        password: bcrypt.hashSync('123456', 10),
        address: "台北",
        tel: "09123456789",
        isAdmin: false,
      }
    })

    const user2 = await tx.user.create({
      data: {
        username: "user2",
        email: "user2@gmail.com",
        password: bcrypt.hashSync('123456', 10),
        address: "台北",
        tel: "09123456789",
        isAdmin: false,
      }
    })

    await tx.cart.create({ data: { buyerId: admin.id } })
    await tx.cart.create({ data: { buyerId: user1.id } })
    await tx.cart.create({ data: { buyerId: user2.id } })

  })
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