module.exports = {
    UnauthorizedError: class UnauthorizedError extends Error {
        constructor() {
            super("You are not allowed to access to this route.");
            super.code = 'user.unauthorized'
        }
    }, 
    NotAuthenticatedError: class NotAuthenticatedError extends Error {
        constructor() {
            super("You need to login before access to this route.");
            super.code = 'user.notAuthenticated'
        }
    },
    DataNotFoundError: class DataNotFoundError extends Error {
        constructor(message) {
            super(message)
            super.code = 'data.notfound'
        }
    }
}