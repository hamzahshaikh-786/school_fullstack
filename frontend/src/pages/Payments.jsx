import { useEffect, useMemo, useState } from 'react'
import { ClipboardIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'
import { fetchTransactions } from '../lib/api'

const STATUSES = ['All', 'Success', 'Pending', 'Failed']

function generateDummyPayments() {
    const institutes = [
        'Alpha Academy',
        'Beta Institute',
        'Gamma College',
        'Delta School',
        'Epsilon University',
    ]
    const students = [
        'Aarav Sharma',
        'Isha Patel',
        'Rohan Gupta',
        'Ananya Singh',
        'Kabir Mehta',
        'Zara Khan',
        'Vivaan Rao',
        'Diya Kapoor',
        'Arjun Nair',
        'Maya Joshi',
    ]
    const methods = ['UPI', 'Card', 'NetBanking', 'Wallet']
    const statuses = ['Success', 'Pending', 'Failed']

    const payments = []
    for (let i = 1; i <= 25; i++) {
        const orderId = `ORD-${String(100000 + i)}`
        const orderAmount = Number((Math.random() * 900 + 100).toFixed(2))
        const fee = Number((Math.random() * 20).toFixed(2))
        const transactionAmount = Number((orderAmount - fee).toFixed(2))
        const date = new Date()
        date.setDate(date.getDate() - (25 - i))
        const phone = `9${Math.floor(100000000 + Math.random() * 899999999)}`

        payments.push({
            id: i,
            institute: institutes[i % institutes.length],
            dateTime: date.toISOString(),
            orderId,
            orderAmount,
            transactionAmount,
            method: methods[i % methods.length],
            status: statuses[i % statuses.length],
            student: students[i % students.length],
            phone,
        })
    }
    return payments
}

function formatDateTime(isoString) {
    const d = new Date(isoString)
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
}

function getStatusClasses(status) {
    if (status === 'Success') return 'bg-green-100 text-green-700 ring-1 ring-green-200'
    if (status === 'Pending') return 'bg-yellow-100 text-yellow-800 ring-1 ring-yellow-200'
    return 'bg-red-100 text-red-700 ring-1 ring-red-200'
}

export default function Payments() {
    const navigate = useNavigate()
    const [backendRows, setBackendRows] = useState([])
    const [backendTotal, setBackendTotal] = useState(0)
    const [useBackend, setUseBackend] = useState(true)
    const allPayments = useMemo(() => {
        if (useBackend && backendRows.length > 0) {
            return backendRows.map((r, idx) => ({
                id: idx + 1,
                institute: r.school_id || 'Unknown School',
                dateTime: r.status?.payment_time || r.createdAt || new Date().toISOString(),
                orderId: r.custom_order_id || String(r._id),
                orderAmount: Number(r.status?.order_amount ?? r.metadata?.order_amount ?? 0),
                transactionAmount: Number(r.status?.transaction_amount ?? 0),
                method: r.status?.payment_mode || '—',
                status: (r.status?.status || 'pending').charAt(0).toUpperCase() + (r.status?.status || 'pending').slice(1),
                student: r.student_info?.name || '—',
                phone: r.student_info?.id || '—',
            }))
        }
        return generateDummyPayments()
    }, [useBackend, backendRows])

    const [searchOrderId, setSearchOrderId] = useState('')
    const [statusFilter, setStatusFilter] = useState('All')
    const [page, setPage] = useState(1)
    const rowsPerPage = 10

useEffect(() => {
    (async () => {
      try {
        const res = await fetchTransactions({ page: 1, limit: rowsPerPage });
        setBackendRows(res.data || []);
        setBackendTotal(res.total || 0);
        setUseBackend(true);
      } catch (_e) {
        setUseBackend(false);
      }
    })();
  }, []);

    const filtered = useMemo(() => {
        return allPayments.filter((p) => {
            const matchesOrder = p.orderId.toLowerCase().includes(searchOrderId.trim().toLowerCase())
            const matchesStatus = statusFilter === 'All' ? true : p.status === statusFilter
            return matchesOrder && matchesStatus
        })
    }, [allPayments, searchOrderId, statusFilter])

    const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage))
    const currentPage = Math.min(page, totalPages)
    const startIndex = (currentPage - 1) * rowsPerPage
    const visible = filtered.slice(startIndex, startIndex + rowsPerPage)

    function handlePrev() {
        setPage((p) => Math.max(1, p - 1))
    }

    function handleNext() {
        setPage((p) => Math.min(totalPages, p + 1))
    }

    function handleCopy(text) {
        if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text)
        }
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Payments Dashboard</h1>
                    <button
                        onClick={() => navigate('/create-payment')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Create Payment
                    </button>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
                    <div className="flex flex-1 gap-3">
                        <div className="relative flex-1 max-w-md">
                            <input
                                type="text"
                                value={searchOrderId}
                                onChange={(e) => {
                                    setPage(1)
                                    setSearchOrderId(e.target.value)
                                }}
                                placeholder="Search by Order ID"
                                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                                    <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 3.473 9.8l3.613 3.614a.75.75 0 1 0 1.06-1.06l-3.614-3.614A5.5 5.5 0 0 0 9 3.5Zm-4 5.5a4 4 0 1 1 8 0 4 4 0 0 1-8 0Z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>

                        <select
                            value={statusFilter}
                            onChange={(e) => {
                                setPage(1)
                                setStatusFilter(e.target.value)
                            }}
                            className="w-full sm:w-44 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            {STATUSES.map((s) => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>

                    <div className="text-sm text-gray-500 mt-1 sm:mt-0">Rows per page: {rowsPerPage}</div>
                </div>

                <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Sr. No</th>
                                <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Institute Name</th>
                                <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Date & Time</th>
                                <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Order ID</th>
                                <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Order Amount</th>
                                <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Transaction Amount</th>
                                <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Payment Method</th>
                                <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                                <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Student Name</th>
                                <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Phone Number</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                            {visible.map((p, idx) => (
                                <tr key={p.id} className="hover:bg-gray-50 table-row">
                                    <td className="px-3 py-3 text-sm text-gray-700">{startIndex + idx + 1}</td>
                                    <td className="px-3 py-3 text-sm font-medium text-gray-900">
                                        <button
                                            onClick={() => navigate(`/school/${p.schoolId || 'SCHOOL1'}`)}
                                            className="text-blue-600 hover:text-blue-800 hover:underline"
                                        >
                                            {p.institute}
                                        </button>
                                    </td>
                                    <td className="px-3 py-3 text-sm text-gray-700 whitespace-nowrap">{formatDateTime(p.dateTime)}</td>
                                    <td className="px-3 py-3 text-sm text-gray-700">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => navigate(`/transaction/${p.orderId}`)}
                                                className="font-mono text-blue-600 hover:text-blue-800 hover:underline"
                                            >
                                                {p.orderId}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleCopy(p.orderId)}
                                                className="inline-flex items-center rounded-md border border-gray-300 bg-white p-1 text-gray-700 hover:bg-gray-100 active:bg-gray-200"
                                                title="Copy Order ID"
                                                aria-label="Copy Order ID"
                                            >
                                                <ClipboardIcon className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-3 py-3 text-sm text-gray-700">₹{p.orderAmount.toFixed(2)}</td>
                                    <td className="px-3 py-3 text-sm text-gray-700">₹{p.transactionAmount.toFixed(2)}</td>
                                    <td className="px-3 py-3 text-sm text-gray-700">{p.method}</td>
                                    <td className="px-3 py-3 text-sm">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClasses(p.status)}`}>
                                            {p.status}
                                        </span>
                                    </td>
                                    <td className="px-3 py-3 text-sm text-gray-700">{p.student}</td>
                                    <td className="px-3 py-3 text-sm text-gray-700 whitespace-nowrap">{p.phone}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-sm text-gray-600">
                        Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                        <span className="font-medium">{Math.min(startIndex + rowsPerPage, filtered.length)}</span> of{' '}
                        <span className="font-medium">{filtered.length}</span> payments
                    </div>
                    <div className="inline-flex items-center gap-2">
                        <button
                            type="button"
                            onClick={handlePrev}
                            disabled={currentPage === 1}
                            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 enabled:hover:bg-gray-50 disabled:opacity-50"
                        >
                            Prev
                        </button>
                        <span className="text-sm text-gray-600">Page {currentPage} of {totalPages}</span>
                        <button
                            type="button"
                            onClick={handleNext}
                            disabled={currentPage === totalPages}
                            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 enabled:hover:bg-gray-50 disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}


