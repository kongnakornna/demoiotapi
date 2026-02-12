"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
function errorHandler(error, req, res, next) {
    console.error('Global error handler:', error);
    if (error.message.includes('invalid input syntax for type integer')) {
        return res.status(400).json({
            statusCode: 400,
            code: 400,
            message: 'Invalid input data',
            message_th: 'ข้อมูลที่ป้อนไม่ถูกต้อง',
            details: 'One or more fields contain invalid numeric values'
        });
    }
    return res.status(500).json({
        statusCode: 500,
        code: 500,
        message: 'Internal server error',
        message_th: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์'
    });
}
exports.errorHandler = errorHandler;
//# sourceMappingURL=error-handler.js.map