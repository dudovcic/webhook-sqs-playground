import { Request, RequestHandler, Response, NextFunction } from 'express';
import { IServices } from '../services';
import { IApiResponse, IErrorResponse } from '../types/response';

interface TypedRequest<P, B, Q> extends Request {
  params: P;
  body: B;
  query: Q;
}

export interface UnauthTypedRequest<P, B, Q> extends TypedRequest<P, B, Q> {}

export type TypedRequestHandler<TR, R> = (
  req: TR,
  res: Response,
  next?: NextFunction
) => R;

export const sendResponseMiddleware = <
  P,
  B,
  TR,
  Q extends UnauthTypedRequest<P, B, Q>,
  R
>(
  fn: TypedRequestHandler<TR, IApiResponse<R>>
): TypedRequestHandler<TR, Promise<void>> => async (
  req: TR,
  res: Response,
  next?: NextFunction
): Promise<void> => {
  try {
    const data = await fn(req, res, next);
    if (data && (data as any).hasOwnProperty('statusCode')) {
      const error = data as IErrorResponse;
      res.status(error.statusCode).send(error);
    } else {
      res.send(data);
    }
  } catch (err) {
    return next && next(err);
  }
};

export const unauthRequest = <
  C,
  P,
  B,
  Q,
  Req extends UnauthTypedRequest<P, B, Q>,
  Res
>(
  config: config.IConfig,
  services: IServices,
  controller: (config: config.IConfig, services: IServices) => C,
  action: (c: C) => TypedRequestHandler<Req, IApiResponse<Res>>
): RequestHandler => async (
  req: Request,
  res: Response,
  next?: NextFunction
): Promise<void> => {
  const cont = controller(config, services);
  const fn = action(cont);

  return sendResponseMiddleware(fn)(req as Req, res, next);
};
