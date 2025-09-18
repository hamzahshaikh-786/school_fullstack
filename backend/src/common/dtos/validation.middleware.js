export function validateDto(zodSchema) {
    return (req, res, next) => {
        try {
            const parsed = zodSchema.parse(req.body)
            req.validatedBody = parsed
            next()
        } catch (error) {
            if (error?.issues) {
                return res.status(400).json({
                    message: 'Validation failed',
                    errors: error.issues.map(i => ({ field: i.path.join('.'), message: i.message }))
                })
            }
            return res.status(400).json({ message: 'Invalid request body' })
        }
    }
}
