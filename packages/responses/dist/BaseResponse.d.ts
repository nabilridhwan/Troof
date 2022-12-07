import type { Request, Response } from "express";
export default class BaseResponse {
    status: number;
    message: string;
    data: object | any[];
    error: boolean;
    constructor(status: number, message: string, data: object | any[]);
    handleResponse(req: Request, res: Response): Response<any, Record<string, any>>;
}
