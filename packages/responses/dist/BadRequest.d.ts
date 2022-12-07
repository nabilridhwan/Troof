import BaseResponse from "./BaseResponse";
export default class BadRequest extends BaseResponse {
    constructor(message: string, data: object | any[]);
}
