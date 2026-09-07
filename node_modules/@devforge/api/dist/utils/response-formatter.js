"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendError = exports.sendSuccess = void 0;
const sendSuccess = (res, data, statusCode = 200, meta) => {
    const payload = {
        success: true,
        data,
        meta: {
            timestamp: new Date().toISOString(),
            ...meta,
        },
    };
    return res.status(statusCode).json(payload);
};
exports.sendSuccess = sendSuccess;
const sendError = (res, statusCode, code, message, details) => {
    const payload = {
        success: false,
        error: {
            code,
            message,
            details,
        },
        meta: {
            timestamp: new Date().toISOString(),
        },
    };
    return res.status(statusCode).json(payload);
};
exports.sendError = sendError;
