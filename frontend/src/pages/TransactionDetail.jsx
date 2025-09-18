import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../lib/api'

export default function TransactionDetail() {
    const { custom_order_id } = useParams()
    const navigate = useNavigate()
    const [transaction, setTransaction] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchTransaction = async () => {
            try {
                const data = await api.getTransactionStatus(custom_order_id)
                setTransaction(data)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchTransaction()
    }, [custom_order_id])

    if (loading) return <div className="p-8 text-center">Loading...</div>
    if (error) return <div className="p-8 text-center text-red-600">Error: {error}</div>
    if (!transaction) return <div className="p-8 text-center">Transaction not found</div>

    const getStatusBadge = (status) => {
        const colors = {
            success: 'bg-green-100 text-green-800',
            pending: 'bg-yellow-100 text-yellow-800',
            failed: 'bg-red-100 text-red-800',
            refund: 'bg-gray-100 text-gray-800'
        }
        return `px-2 py-1 rounded-full text-xs font-medium ${colors[status] || colors.pending}`
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">Transaction Details</h1>
                        <button
                            onClick={() => navigate('/')}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Back to Dashboard
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Order ID</label>
                                <p className="mt-1 text-sm text-gray-900 font-mono">{transaction.custom_order_id}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Status</label>
                                <span className={`inline-block mt-1 ${getStatusBadge(transaction.status)}`}>
                                    {transaction.status?.toUpperCase()}
                                </span>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Order Amount</label>
                                <p className="mt-1 text-sm text-gray-900">₹{transaction.order_amount?.toLocaleString()}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Transaction Amount</label>
                                <p className="mt-1 text-sm text-gray-900">₹{transaction.transaction_amount?.toLocaleString()}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                                <p className="mt-1 text-sm text-gray-900">{transaction.payment_mode || 'N/A'}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Bank Reference</label>
                                <p className="mt-1 text-sm text-gray-900 font-mono">{transaction.bank_reference || 'N/A'}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Payment Time</label>
                                <p className="mt-1 text-sm text-gray-900">
                                    {transaction.payment_time ? new Date(transaction.payment_time).toLocaleString() : 'N/A'}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Student Name</label>
                                <p className="mt-1 text-sm text-gray-900">{transaction.student_name || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    {transaction.payment_message && (
                        <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-700">Payment Message</label>
                            <p className="mt-1 text-sm text-gray-900">{transaction.payment_message}</p>
                        </div>
                    )}

                    {transaction.error_message && (
                        <div className="mt-6">
                            <label className="block text-sm font-medium text-red-700">Error Message</label>
                            <p className="mt-1 text-sm text-red-600">{transaction.error_message}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
