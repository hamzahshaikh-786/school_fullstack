import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api'

export default function CreatePayment() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        school_id: 'SCHOOL1',
        trustee_id: 'TRUST1',
        student_info: {
            name: '',
            id: '',
            email: ''
        },
        gateway_name: 'PhonePe',
        order_amount: '',
        custom_order_id: '',
        metadata: {}
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)

    const handleChange = (e) => {
        const { name, value } = e.target
        if (name.startsWith('student_info.')) {
            const field = name.split('.')[1]
            setFormData(prev => ({
                ...prev,
                student_info: {
                    ...prev.student_info,
                    [field]: value
                }
            }))
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }))
        }
    }

    const generateOrderId = () => {
        const timestamp = Date.now()
        const random = Math.floor(Math.random() * 1000)
        const orderId = `ORDER-${timestamp}-${random}`
        setFormData(prev => ({
            ...prev,
            custom_order_id: orderId
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            // Convert order_amount to a number
            const payload = {
                ...formData,
                order_amount: parseFloat(formData.order_amount),
            };
            const data = await api.createPayment(payload);
            setSuccess(`Payment created successfully! Order ID: ${data.order_id}`);

            // // Show redirect URL
            // if (data.redirect_url) {
            //     setTimeout(() => {
            //         window.open(data.redirect_url, '_blank');
            //     }, 2000);
            // }
            } catch (err) {
            // Check if backend says payment already exists
            if (err.message.includes('already exists')) {
                setError('Payment with this Order ID already exists!');
            } else {
                setError(err.message);
            }
        } finally {
            setLoading(false);
        }

    };

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">Create Payment</h1>
                        <button
                            onClick={() => navigate('/')}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Back to Dashboard
                        </button>
                    </div>

                    {error && (
                        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    School ID
                                </label>
                                <input
                                    type="text"
                                    name="school_id"
                                    value={formData.school_id}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Trustee ID
                                </label>
                                <input
                                    type="text"
                                    name="trustee_id"
                                    value={formData.trustee_id}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Student Name
                                </label>
                                <input
                                    type="text"
                                    name="student_info.name"
                                    value={formData.student_info.name}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Student ID
                                </label>
                                <input
                                    type="text"
                                    name="student_info.id"
                                    value={formData.student_info.id}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Student Email
                            </label>
                            <input
                                type="email"
                                name="student_info.email"
                                value={formData.student_info.email}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Gateway Name
                                </label>
                                <select
                                    name="gateway_name"
                                    value={formData.gateway_name}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                >
                                    <option value="PhonePe">PhonePe</option>
                                    <option value="Razorpay">Razorpay</option>
                                    <option value="PayU">PayU</option>
                                    <option value="Stripe">Stripe</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Order Amount (₹)
                                </label>
                                <input
                                    type="number"
                                    name="order_amount"
                                    value={formData.order_amount}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    min="1"
                                    step="0.01"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Custom Order ID
                            </label>
                            <div className="flex space-x-2">
                                <input
                                    type="text"
                                    name="custom_order_id"
                                    value={formData.custom_order_id}
                                    onChange={handleChange}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={generateOrderId}
                                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                                >
                                    Generate
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-4">
                            <button
                                type="button"
                                onClick={() => navigate('/')}
                                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Creating...' : 'Create Payment'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
