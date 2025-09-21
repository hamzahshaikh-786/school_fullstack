import jwt from 'jsonwebtoken'

export function signJwt(payload, expiresIn = '365d') {
    const secret = process.env.JWT_SECRET || 'dev_secret'
    return jwt.sign(payload, secret, { expiresIn })
}

export function verifyJwt(token) {
    const secret = process.env.JWT_SECRET || 'dev_secret'
    return jwt.verify(token, secret)
}

export function authMiddleware(req, res, next) {
    try {
        const header = req.headers.authorization || ''
        const token = header.startsWith('Bearer ') ? header.slice(7) : null
        if (!token) return res.status(401).json({ message: 'Unauthorized' })
        console.log("JWT Secret:", process.env.JWT_SECRET);
        const payload = verifyJwt(token)
        req.user = payload
        next()
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' })
    }
}


