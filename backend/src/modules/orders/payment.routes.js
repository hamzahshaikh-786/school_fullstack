import { Router } from 'express'
import { validateDto } from '../../common/dtos/validation.middleware.js'
import { CreatePaymentDto } from '../../common/dtos/createPayment.dto.js'
import { Order } from './order.model.js'
import { OrderStatus } from './orderStatus.model.js'
import { signJwt } from '../../common/utils/auth.js'

export const paymentRouter = Router()

paymentRouter.post('/create-payment', validateDto(CreatePaymentDto), async (req, res) => {
    try {
        const dto = req.validatedBody

        const order = await Order.create({
            school_id: dto.school_id,
            trustee_id: dto.trustee_id,
            student_info: dto.student_info,
            gateway_name: dto.gateway_name,
            custom_order_id: dto.custom_order_id,
            metadata: dto.metadata || {},
        })

        // Initialize status as pending
        await OrderStatus.create({
            collect_id: order._id,
            order_amount: Number(dto.order_amount ?? 0),
            transaction_amount: 0,
            payment_mode: 'unknown',
            status: 'pending',
            payment_details: {},
        })

        // Mock payment provider redirect by signing payload
        const providerPayload = signJwt({
            order_id: String(order._id),
            custom_order_id: order.custom_order_id,
            school_id: order.school_id,
        }, '10m')

        const redirectUrl = `https://mock-pay.example/redirect?token=${providerPayload}`
        return res.status(201).json({ order_id: order._id, redirect_url: redirectUrl })
    } catch (err) {
        return res.status(500).json({ message: 'Failed to create payment' })
    }
})


