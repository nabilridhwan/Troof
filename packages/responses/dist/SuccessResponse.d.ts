import BaseResponse from "./BaseResponse";
export default class SuccessResponse extends BaseResponse {
    constructor(message: string, data: object | any[]);
}
