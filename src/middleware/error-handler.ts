// middleware/error-handler.ts
import { Request, Response, NextFunction } from 'express';
export function errorHandler(
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
) {
    console.error('Global error handler:', error);
    
    // ตรวจสอบว่า error เป็น validation error หรือไม่
    if (error.message.includes('invalid input syntax for type integer')) {
        return res.status(400).json({
            statusCode: 400,
            code: 400,
            message: 'Invalid input data',
            message_th: 'ข้อมูลที่ป้อนไม่ถูกต้อง',
            details: 'One or more fields contain invalid numeric values'
        });
    }
    
    // Default error response
    return res.status(500).json({
        statusCode: 500,
        code: 500,
        message: 'Internal server error',
        message_th: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์'
    });
}

/*
// app.module.ts หรือ main.ts
import { errorHandler } from './middleware/error-handler';
// ... หลังจากการกำหนด routes ทั้งหมด
app.use(errorHandler);

*/