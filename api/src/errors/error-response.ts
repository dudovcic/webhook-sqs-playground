import { IErrorResponse } from '../types/response';

export const badRequest = (reason: string, validationErrors: string[]): IErrorResponse => ({
  statusCode: 400,
  reason,
  validationErrors
});

export const internal = (reason: string): IErrorResponse => ({
  statusCode: 500,
  reason
});
