import { RequestHandler } from 'express';
import {
  TypedRequestHandler,
  unauthRequest,
  UnauthTypedRequest
} from '../../middleware/request-middleware';
import { IServices } from '../../services';
import { IApiResponse } from '../../types/response';

export type UnauthorisedRouteHandlerBuilder = <P, B, Q, Res, C>(
  controller: (c: config.IConfig, s: IServices) => C,
  action: (
    c: C
  ) => TypedRequestHandler<UnauthTypedRequest<P, B, Q>, IApiResponse<Res>>
) => RequestHandler;

export const unauthRequestHandlerBuilder = (
  c: config.IConfig,
  s: IServices
): UnauthorisedRouteHandlerBuilder => {
  return <C, P, B, Q, Res>(
    controller: (c: config.IConfig, s: IServices) => C,
    action: (
      c: C
    ) => TypedRequestHandler<UnauthTypedRequest<P, B, Q>, IApiResponse<Res>>
  ): RequestHandler => unauthRequest(c, s, controller, action);
};
