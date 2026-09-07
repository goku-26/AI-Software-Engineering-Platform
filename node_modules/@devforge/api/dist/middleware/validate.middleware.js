"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const express_validator_1 = require("express-validator");
const api_error_1 = require("../utils/api-error");
const validate = (validations) => {
    return async (req, _res, next) => {
        await Promise.all(validations.map((validation) => validation.run(req)));
        const errors = (0, express_validator_1.validationResult)(req);
        if (errors.isEmpty()) {
            return next();
        }
        const formattedErrors = errors.array().map((err) => ({
            field: err.type === 'field' ? err.path : err.type,
            message: err.msg,
        }));
        next(api_error_1.ApiError.badRequest('Validation Failed', 'VALIDATION_ERROR', formattedErrors));
    };
};
exports.validate = validate;
