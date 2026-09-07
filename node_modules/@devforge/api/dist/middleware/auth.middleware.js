"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jwt_1 = require("../utils/jwt");
const api_error_1 = require("../utils/api-error");
const authenticate = (req, _res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw api_error_1.ApiError.unauthorized('Authentication token required');
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            throw api_error_1.ApiError.unauthorized('Invalid authorization header format');
        }
        const decoded = (0, jwt_1.verifyToken)(token);
        req.user = decoded;
        next();
    }
    catch (error) {
        if (error instanceof api_error_1.ApiError) {
            next(error);
        }
        else {
            next(api_error_1.ApiError.unauthorized('Invalid or expired token'));
        }
    }
};
exports.authenticate = authenticate;
