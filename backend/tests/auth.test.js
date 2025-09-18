import request from 'supertest'
import mongoose from 'mongoose'
import { createApp } from '../app.js'

const app = createApp()

beforeAll(async () => {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/school_fullstack_test'
    await mongoose.connect(mongoUri)
})

afterAll(async () => {
    await mongoose.connection.dropDatabase()
    await mongoose.disconnect()
})

test('register and login flow', async () => {
    const email = `test_${Date.now()}@example.com`
    const password = 'StrongP@ssw0rd'

    const reg = await request(app).post('/auth/register').send({ email, password, role: 'school' })
    expect(reg.status).toBe(201)

    const login = await request(app).post('/auth/login').send({ email, password })
    expect(login.status).toBe(200)
    expect(login.body.token).toBeDefined()
})


