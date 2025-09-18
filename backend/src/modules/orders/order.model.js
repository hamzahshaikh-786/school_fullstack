import mongoose from 'mongoose'

const studentInfoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    id: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    }
}, { _id: false })

const orderSchema = new mongoose.Schema({
    school_id: {
        type: String,
        required: true,
        trim: true
    },
    trustee_id: {
        type: String,
        required: true,
        trim: true
    },
    student_info: {
        type: studentInfoSchema,
        required: true
    },
    gateway_name: {
        type: String,
        required: true,
        trim: true
    },
    custom_order_id: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    versionKey: false
})

// Indexes
orderSchema.index({ school_id: 1 })
orderSchema.index({ trustee_id: 1 })
orderSchema.index({ custom_order_id: 1 })
orderSchema.index({ createdAt: -1 })

export const Order = mongoose.model('Order', orderSchema)
