import request from 'supertest'
import mongoose from 'mongoose'
import { createApp } from '../app.js'
import { signJwt } from '../src/common/utils/auth.js'

const app = createApp()

beforeAll(async () => {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/school_fullstack_test'
    await mongoose.connect(mongoUri)
})

afterAll(async () => {
    await mongoose.connection.dropDatabase()
    await mongoose.disconnect()
})

test('create-payment requires auth', async () => {
    const res = await request(app).post('/create-payment').send({})
    expect(res.status).toBe(401)
})

test('create-payment and webhook processing', async () => {
    const token = signJwt({ sub: 'user1', role: 'school' })
    const dto = {
        school_id: 'SCHOOL1',
        trustee_id: 'TRUST1',
        student_info: { name: 'John Doe', id: 'STU1', email: 'john@example.com' },
        gateway_name: 'MockGateway',
        order_amount: 123.45,
        custom_order_id: 'ORD_TEST_1',
    }
    const create = await request(app)
        .post('/create-payment')
        .set('Authorization', `Bearer ${token}`)
        .send(dto)
    expect(create.status).toBe(201)
    expect(create.body.order_id).toBeDefined()

    const webhookPayload = {
        order_id: String(create.body.order_id),
        order_amount: 123.45,
        transaction_amount: 123.45,
        payment_mode: 'UPI',
        status: 'success',
        payment_time: new Date().toISOString(),
    }
    const webhook = await request(app).post('/webhook').send(webhookPayload)
    expect(webhook.status).toBe(200)
})


