import 'dotenv/config'
import mongoose from 'mongoose'
import { createApp } from './app.js'

async function bootstrap() {
    const port = Number(process.env.PORT || 4005)
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/school_fullstack'

    mongoose.set('strictQuery', true)
    try {
        await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2000 })
        console.log('Connected to MongoDB')
    } catch (err) {
        console.warn('MongoDB not reachable, starting API without DB. Some routes may fail.')
    }

    const app = createApp()
    app.listen(port, '0.0.0.0', () => {
        console.log(`API listening on http://localhost:${port}`)
        console.log(`API also available on http://0.0.0.0:${port}`)
    })
}

bootstrap()


