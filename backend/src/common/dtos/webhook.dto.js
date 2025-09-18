import { z } from 'zod'

const OrderInfo = z.object({
    order_id: z.string().min(1),
    order_amount: z.number().nonnegative(),
    transaction_amount: z.number().nonnegative().optional(),
    payment_mode: z.string().min(1),
    status: z.enum(['pending', 'success', 'failed', 'refund']),
    payment_time: z.string().datetime().optional(),
    bank_reference: z.string().optional(),
    payment_message: z.string().optional(),
}).passthrough()

export const WebhookDto = z.union([
    // shape 1: flat
    z.object({
        order_id: z.string().min(1),
        order_amount: z.number().nonnegative(),
        transaction_amount: z.number().nonnegative().optional(),
        payment_mode: z.string().min(1),
        payment_details: z.object({}).passthrough().optional(),
        bank_reference: z.string().optional(),
        payment_message: z.string().optional(),
        status: z.enum(['pending', 'success', 'failed', 'refund']),
        error_message: z.string().optional(),
        payment_time: z.string().datetime().optional(),
        collect_id: z.string().optional(),
    }),
    // shape 2: with order_info and optional misspelled payemnt_details
    z.object({
        order_info: OrderInfo,
        payment_details: z.object({}).passthrough().optional(),
        payemnt_details: z.object({}).passthrough().optional(),
    })
])
