import { Router } from 'express'
import { validateDto } from '../../common/dtos/validation.middleware.js'
import { WebhookDto } from '../../common/dtos/webhook.dto.js'
import { WebhookLog } from './webhookLog.model.js'
import { Order } from '../orders/order.model.js'
import { OrderStatus } from '../orders/orderStatus.model.js'

export const webhookRouter = Router()

webhookRouter.post('/webhook', validateDto(WebhookDto), async (req, res) => {
    // Immediately respond 200
    res.status(200).json({ received: true })

    // Process asynchronously
    const payload = req.validatedBody
    const flat = payload.order_info ? { ...payload.order_info, ...(payload.payment_details || payload.payemnt_details || {}) } : payload
    try {
        await WebhookLog.create({ raw_payload: payload, processed: false })

        const collectId = flat.collect_id || flat.order_id?.replace('ORD-', '')
        const order = await Order.findOne({ _id: collectId }).lean()
        if (!order) return

        await OrderStatus.findOneAndUpdate(
            { collect_id: order._id },
            {
                collect_id: order._id,
                order_amount: flat.order_amount,
                transaction_amount: flat.transaction_amount ?? flat.order_amount,
                payment_mode: flat.payment_mode,
                payment_details: payload.payment_details || payload.payemnt_details || {},
                bank_reference: flat.bank_reference,
                payment_message: flat.payment_message,
                status: flat.status,
                error_message: flat.error_message,
                payment_time: flat.payment_time ? new Date(flat.payment_time) : new Date(),
                updatedAt: new Date(),
            },
            { upsert: true, new: true }
        )

        await WebhookLog.updateOne({ raw_payload: payload }, { processed: true })
    } catch (err) {
        await WebhookLog.create({ raw_payload: payload, processed: false, error: err.message })
    }
})


