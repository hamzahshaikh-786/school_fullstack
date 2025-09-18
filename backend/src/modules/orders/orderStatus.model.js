import mongoose from 'mongoose'

const orderStatusSchema = new mongoose.Schema({
    collect_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    order_amount: {
        type: Number,
        required: true,
        min: 0
    },
    transaction_amount: {
        type: Number,
        required: true,
        min: 0
    },
    payment_mode: {
        type: String,
        required: true,
        trim: true
    },
    payment_details: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    bank_reference: {
        type: String,
        trim: true
    },
    payment_message: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'success', 'failed', 'refund'],
        default: 'pending'
    },
    error_message: {
        type: String,
        trim: true
    },
    payment_time: {
        type: Date
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    versionKey: false
})

// Indexes
orderStatusSchema.index({ collect_id: 1 })
orderStatusSchema.index({ status: 1 })
orderStatusSchema.index({ payment_time: -1 })
orderStatusSchema.index({ updatedAt: -1 })

export const OrderStatus = mongoose.model('OrderStatus', orderStatusSchema)
