import { Router } from 'express'
import bcrypt from 'bcrypt'
import { User } from '../users/user.model.js'
import { signJwt } from '../../common/utils/auth.js'

export const authRouter = Router()

authRouter.post('/register', async (req, res) => {
    try {
        const { email, password, role } = req.body
        if (!email || !password || !role) {
            return res.status(400).json({ message: 'email, password, role required' })
        }
        const existing = await User.findOne({ email })
        if (existing) return res.status(409).json({ message: 'Email already registered' })
        const hash = await bcrypt.hash(password, 10)
        const user = await User.create({ email, passwordHash: hash, role })
        return res.status(201).json({ id: user._id, email: user.email, role: user.role })
    } catch (err) {
        return res.status(500).json({ message: 'Registration failed' })
    }
})

authRouter.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) return res.status(400).json({ message: 'email and password required' })
        const user = await User.findOne({ email })
        if (!user) return res.status(401).json({ message: 'Invalid credentials' })
        const ok = await bcrypt.compare(password, user.passwordHash)
        if (!ok) return res.status(401).json({ message: 'Invalid credentials' })
        const token = signJwt({ sub: String(user._id), role: user.role })
        return res.json({ token, user: { id: user._id, email: user.email, role: user.role } })
    } catch (err) {
        return res.status(500).json({ message: 'Login failed' })
    }
})


