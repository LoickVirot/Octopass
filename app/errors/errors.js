module.exports = {
    UnauthorizedError: class UnauthorizedError extends Error {
        constructor() {
            super("You are not allowed to access to this route.")
            super.code = 'user.unauthorized'
        }
    }, 
    NotAuthenticatedError: class NotAuthenticatedError extends Error {
        constructor() {
            super("You need to login before access to this route.")
            super.code = 'user.notAuthenticated'
        }
    },
    NotFoundError: class NotFountError extends Error {
        constructor(message = null) {
            if (message === null)
                message = "requested object not found."
            super(message)
            super.code = 'base.notFound'
        }
    },
}