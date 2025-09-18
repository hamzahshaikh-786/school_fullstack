import mongoose from 'mongoose'

const webhookLogSchema = new mongoose.Schema({
    raw_payload: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    receivedAt: {
        type: Date,
        default: Date.now
    },
    processed: {
        type: Boolean,
        default: false
    },
    error: {
        type: String,
        trim: true
    }
}, {
    timestamps: true,
    versionKey: false
})

// Indexes
webhookLogSchema.index({ receivedAt: -1 })
webhookLogSchema.index({ processed: 1 })

export const WebhookLog = mongoose.model('WebhookLog', webhookLogSchema)
