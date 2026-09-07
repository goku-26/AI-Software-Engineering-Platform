"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const api_error_1 = require("../utils/api-error");
const response_formatter_1 = require("../utils/response-formatter");
const env_1 = require("../config/env");
const errorHandler = (err, _req, res, _next) => {
    if (err instanceof api_error_1.ApiError) {
        return (0, response_formatter_1.sendError)(res, err.statusCode, err.code, err.message, err.details);
    }
    console.error('[Unhandled Error]', err);
    const message = env_1.env.NODE_ENV === 'production'
        ? 'Internal Server Error'
        : err.message || 'An unexpected error occurred';
    return (0, response_formatter_1.sendError)(res, 500, 'INTERNAL_SERVER_ERROR', message);
};
exports.errorHandler = errorHandler;
