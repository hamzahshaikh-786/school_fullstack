import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { authMiddleware } from './src/common/utils/auth.js'
import { authRouter } from './src/modules/auth/auth.routes.js'
import { paymentRouter } from './src/modules/orders/payment.routes.js'
import { webhookRouter } from './src/modules/webhook/webhook.routes.js'
import { transactionsRouter } from './src/modules/transactions/transactions.routes.js'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import mongoSanitize from 'express-mongo-sanitize'
import xss from 'xss-clean'

export function createApp() {
    const app = express()

    app.use(helmet())
    app.use(mongoSanitize())
    app.use(xss())
    app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }))

    app.use(cors())
    app.use(express.json({ limit: '1mb' }))
    app.use(morgan('dev'))

    app.get('/health', (_req, res) => {
        res.json({ status: 'ok' })
    })

    // Silence favicon 401 noise
    app.get('/favicon.ico', (_req, res) => res.status(204).end())

    // Public routes
    app.use('/auth', authRouter)
    app.use(webhookRouter) // /webhook

    // Protected routes
    // app.use(authMiddleware)
    app.use(paymentRouter)
    app.use(transactionsRouter)

    app.get('/', (_req, res) => {
        res.redirect('/transactions')
    })

    // Not found handler
    app.use((req, res) => {
        res.status(404).json({ message: 'Not Found', path: req.path })
    })

    // Error handler
    // eslint-disable-next-line no-unused-vars
    app.use((err, _req, res, _next) => {
        const status = err.status || 500
        res.status(status).json({
            message: err.message || 'Internal Server Error',
        })
    })

    return app
}