import { Router } from 'express'
import { Order } from '../orders/order.model.js'
import { OrderStatus } from '../orders/orderStatus.model.js'

export const transactionsRouter = Router()

function buildQueryFilters(query) {
    const filters = {}
    if (query.status) filters.status = query.status
    if (query.school_id) filters.school_id = query.school_id
    return filters
}

transactionsRouter.get('/transactions', async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page, 10) || 1)
        const limit = Math.min(50, parseInt(req.query.limit, 10) || 10)
        const sortField = req.query.sort || 'payment_time'
        const sortOrder = req.query.order === 'asc' ? 1 : -1

        const filters = buildQueryFilters(req.query)

        const agg = [
            { $lookup: { from: 'orderstatuses', localField: '_id', foreignField: 'collect_id', as: 'status' } },
            { $unwind: { path: '$status', preserveNullAndEmptyArrays: true } },
            { $match: filters },
            { $sort: { [`status.${sortField}`]: sortOrder } },
            { $skip: (page - 1) * limit },
            { $limit: limit },
        ]

        const data = await Order.aggregate(agg)
        const total = await Order.countDocuments()
        return res.json({ page, limit, total, data })
    } catch (err) {
        return res.status(500).json({ message: 'Failed to fetch transactions' })
    }
})

transactionsRouter.get('/transactions/school/:schoolId', async (req, res) => {
    try {
        const { schoolId } = req.params
        const agg = [
            { $match: { school_id: schoolId } },
            { $lookup: { from: 'orderstatuses', localField: '_id', foreignField: 'collect_id', as: 'status' } },
            { $unwind: { path: '$status', preserveNullAndEmptyArrays: true } },
            { $sort: { 'status.payment_time': -1 } },
        ]
        const data = await Order.aggregate(agg)
        return res.json({ data })
    } catch (err) {
        return res.status(500).json({ message: 'Failed to fetch school transactions' })
    }
})

transactionsRouter.get('/transaction-status/:custom_order_id', async (req, res) => {
    try {
        const { custom_order_id } = req.params
        const order = await Order.findOne({ custom_order_id })
        if (!order) return res.status(404).json({ message: 'Order not found' })
        const status = await OrderStatus.findOne({ collect_id: order._id }).sort({ updatedAt: -1 })
        return res.json({ status })
    } catch (err) {
        return res.status(500).json({ message: 'Failed to fetch transaction status' })
    }
})


