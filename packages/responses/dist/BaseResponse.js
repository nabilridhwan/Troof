"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BaseResponse {
    constructor(status, message, data) {
        this.status = status;
        this.message = message;
        this.data = data;
        this.error = false;
        if (status >= 400) {
            this.error = true;
        }
    }
    handleResponse(req, res) {
        return res.status(this.status).json({
            status: this.status,
            error: this.error,
            message: this.message,
            data: this.data,
        });
    }
}
exports.default = BaseResponse;
