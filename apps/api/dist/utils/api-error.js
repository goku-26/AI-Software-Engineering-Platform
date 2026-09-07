"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = void 0;
class ApiError extends Error {
    statusCode;
    code;
    details;
    constructor(statusCode, code, message, details) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.details = details;
        Object.setPrototypeOf(this, ApiError.prototype);
    }
    static badRequest(message, code = 'BAD_REQUEST', details) {
        return new ApiError(400, code, message, details);
    }
    static unauthorized(message = 'Unauthorized access', code = 'UNAUTHORIZED') {
        return new ApiError(401, code, message);
    }
    static forbidden(message = 'Access forbidden', code = 'FORBIDDEN') {
        return new ApiError(403, code, message);
    }
    static notFound(message = 'Resource not found', code = 'NOT_FOUND') {
        return new ApiError(404, code, message);
    }
    static conflict(message, code = 'CONFLICT') {
        return new ApiError(409, code, message);
    }
    static internal(message = 'Internal server error', code = 'INTERNAL_ERROR') {
        return new ApiError(500, code, message);
    }
}
exports.ApiError = ApiError;
