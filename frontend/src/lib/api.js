const BASE_URL = 'http://localhost:4005'

const DEMO_EMAIL = 'demo@demo.com'
const DEMO_PASSWORD = 'Demo1234!'

const STATIC_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzdGF0aWNfYWRtaW4iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NTg0MjExMTEsImV4cCI6MjA3Mzc4MTExMX0.n_kRfn7I8mVpZS43LF9HAgAsyj6X0E7iRwvLdIq_uhA';
function getToken() {
    return STATIC_TOKEN;
}

function setToken(token) {
    localStorage.setItem('auth_token', token)
}

async function request(path, options = {}) {
    const headers = new Headers(options.headers || {})
    if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/json')
    const token = getToken()
    if (token && !headers.has('Authorization')) headers.set('Authorization', `Bearer ${token}`)

    const res = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers,
    })
    if (!res.ok) {
        const text = await res.text().catch(() => '')
        throw new Error(text || `HTTP ${res.status}`)
    }
    const ct = res.headers.get('content-type') || ''
    return ct.includes('application/json') ? res.json() : res.text()
}

// export async function ensureAuth() {
//     try {
//         // attempt login first
//         const login = await request('/auth/login', {
//             method: 'POST',
//             body: JSON.stringify({ email: DEMO_EMAIL, password: DEMO_PASSWORD }),
//             headers: { 'Content-Type': 'application/json' },
//         })
//         setToken(login.token)
//         return login.token
//     } catch (_) {
//         // register then login
//         await request('/auth/register', {
//             method: 'POST',
//             body: JSON.stringify({ email: DEMO_EMAIL, password: DEMO_PASSWORD, role: 'school' }),
//             headers: { 'Content-Type': 'application/json' },
//         })
//         const login = await request('/auth/login', {
//             method: 'POST',
//             body: JSON.stringify({ email: DEMO_EMAIL, password: DEMO_PASSWORD }),
//             headers: { 'Content-Type': 'application/json' },
//         })
//         setToken(login.token)
//         return login.token
//     }
// }

export async function fetchTransactions({ page = 1, limit = 10, status = '' } = {}) {
    const params = new URLSearchParams()
    params.set('page', String(page))
    params.set('limit', String(limit))
    if (status && status !== 'All') params.set('status', status.toLowerCase())
    return request(`/transactions?${params.toString()}`)
}

export async function health() {
    return request('/health')
}


// Named API object used by multiple pages
export const api = {
    getTransactions: (params = {}) => {
        const qs = new URLSearchParams()
        if (params.page) qs.set('page', String(params.page))
        if (params.limit) qs.set('limit', String(params.limit))
        if (params.status && params.status !== 'all') qs.set('status', String(params.status))
        if (params.search) qs.set('search', String(params.search))
        return request(`/transactions?${qs.toString()}`)
    },
    getTransactionsBySchool: (schoolId, params = {}) => {
        const qs = new URLSearchParams()
        if (params.page) qs.set('page', String(params.page))
        if (params.limit) qs.set('limit', String(params.limit))
        if (params.status && params.status !== 'all') qs.set('status', String(params.status))
        if (params.search) qs.set('search', String(params.search))
        return request(`/transactions/school/${encodeURIComponent(schoolId)}?${qs.toString()}`)
    },
    getTransactionStatus: (customOrderId) => request(`/transaction-status/${encodeURIComponent(customOrderId)}`),
    createPayment: (data) => request('/create-payment', { method: 'POST', body: JSON.stringify(data) }),
    processWebhook: (data) => request('/webhook', { method: 'POST', body: JSON.stringify(data) }),
}

