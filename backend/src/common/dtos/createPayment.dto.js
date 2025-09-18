import { z } from 'zod'

export const StudentInfoSchema = z.object({
    name: z.string().min(2),
    id: z.string().min(1),
    email: z.string().email(),
})

export const CreatePaymentDto = z.object({
    school_id: z.string().min(1),
    trustee_id: z.string().min(1),
    student_info: StudentInfoSchema,
    gateway_name: z.string().min(1),
    order_amount: z.number().nonnegative(),
    custom_order_id: z.string().regex(/^[A-Z0-9_-]+$/, 'custom_order_id must contain only uppercase letters, numbers, hyphens, and underscores'),
    metadata: z.object({}).passthrough().optional(),
})
