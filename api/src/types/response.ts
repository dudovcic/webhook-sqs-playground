export interface IErrorResponse {
    statusCode: number;
    reason: string;
    validationErrors?: string[];
}

export type IApiResponse<T> = Promise<T | IErrorResponse>;