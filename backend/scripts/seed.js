import 'dotenv/config'
import mongoose from 'mongoose'
import { faker } from '@faker-js/faker'
import { Order } from '../src/modules/orders/order.model.js'
import { OrderStatus } from '../src/modules/orders/orderStatus.model.js'
import { User } from '../src/modules/users/user.model.js'
import bcrypt from 'bcrypt'

async function seed() {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/school_fullstack'
    await mongoose.connect(mongoUri)
    console.log('Connected to MongoDB')

    await Order.deleteMany({})
    await OrderStatus.deleteMany({})
    await User.deleteMany({})

    const schools = [faker.company.name(), faker.company.name()]
    const statuses = ['pending', 'success', 'failed']

    for (const school of schools) {
        for (let i = 0; i < 10; i++) {
            const student = {
                name: faker.person.fullName(),
                id: faker.string.alphanumeric(8),
                email: faker.internet.email().toLowerCase(),
            }

            // Seed admin user
            const adminEmail = 'admin@demo.com'
            const adminPass = 'Admin1234!'
            const hash = await bcrypt.hash(adminPass, 10)
            await User.create({ email: adminEmail, passwordHash: hash, role: 'admin' })
            console.log(`Admin seeded: ${adminEmail} / ${adminPass}`)
            const order = await Order.create({
                school_id: school,
                trustee_id: faker.string.alphanumeric(10),
                student_info: student,
                gateway_name: 'MockGateway',
                custom_order_id: `ORD-${faker.string.alphanumeric({ length: 10, casing: 'upper' })}`,
                metadata: { order_amount: Number(faker.finance.amount({ min: 100, max: 1000, dec: 2 })) },
            })

            const status = faker.helpers.arrayElement(statuses)
            await OrderStatus.create({
                collect_id: order._id,
                order_amount: order.metadata.order_amount,
                transaction_amount: status === 'success' ? order.metadata.order_amount : 0,
                payment_mode: faker.helpers.arrayElement(['UPI', 'Card', 'NetBanking', 'Wallet']),
                payment_details: {},
                bank_reference: faker.finance.transactionDescription(),
                payment_message: status === 'success' ? 'Paid' : status === 'failed' ? 'Failed' : 'Pending',
                status,
                payment_time: new Date(),
            })
        }
    }

    console.log('Seeding completed')
    await mongoose.disconnect()
}

seed().catch((e) => {
    console.error(e)
    process.exit(1)
})


