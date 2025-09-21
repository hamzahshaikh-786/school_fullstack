// frontend/src/api.js
export const API_URL = "https://school-backend-gv15.onrender.com";

const DEMO_EMAIL = 'demo@demo.com';
const DEMO_PASSWORD = 'Demo1234!';

const STATIC_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzdGF0aWNfYWRtaW4iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NTg0MjExMTEsImV4cCI6MjA3Mzc4MTExMX0.n_kRfn7I8mVpZS43LF9HAgAsyj6X0E7iRwvLdIq_uhA';

function getToken() {
    return STATIC_TOKEN;
}

function setToken(token) {
    localStorage.setItem('auth_token', token);
}

async function request(path, options = {}) {
    const headers = new Headers(options.headers || {});
    if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
    const token = getToken();
    if (token && !headers.has('Authorization')) headers.set('Authorization', `Bearer ${token}`);

    // ✅ Use API_URL instead of BASE_URL
    const res = await fetch(`${API_URL}${path}`, {
        ...options,
        headers,
        redirect:"manual",
    });

    if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(text || `HTTP ${res.status}`);
    }

    const ct = res.headers.get('content-type') || '';
    return ct.includes('application/json') ? res.json() : res.text();
}

export async function fetchTransactions({ page = 1, limit = 10, status = '' } = {}) {
    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('limit', String(limit));
    if (status && status !== 'All') params.set('status', status.toLowerCase());
    return request(`/transactions?${    params.toString()}`);
}

export async function health() {
    return request('/health');
}

export const api = {
    getTransactions: (params = {}) => {
        const qs = new URLSearchParams();
        if (params.page) qs.set('page', String(params.page));
        if (params.limit) qs.set('limit', String(params.limit));
        if (params.status && params.status !== 'all') qs.set('status', String(params.status));
        if (params.search) qs.set('search', String(params.search));
        return request(`/transactions?${qs.toString()}`);
    },
    getTransactionsBySchool: (schoolId, params = {}) => {
        const qs = new URLSearchParams();
        if (params.page) qs.set('page', String(params.page));
        if (params.limit) qs.set('limit', String(params.limit));
        if (params.status && params.status !== 'all') qs.set('status', String(params.status));
        if (params.search) qs.set('search', String(params.search));
        return request(`/transactions/school/${encodeURIComponent(schoolId)}?${qs.toString()}`);
    },
    getTransactionStatus: (customOrderId) => request(`/transaction-status/${encodeURIComponent(customOrderId)}`),
    createPayment: (data) => request('/create-payment', { method: 'POST', body: JSON.stringify(data) }),
    processWebhook: (data) => request('/webhook', { method: 'POST', body: JSON.stringify(data) }),
};
