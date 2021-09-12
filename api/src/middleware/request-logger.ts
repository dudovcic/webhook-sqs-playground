import * as morgan from 'morgan';
import * as express from 'express';

export const reqLogger = morgan(
  (
    tokens: morgan.TokenIndexer,
    req: express.Request,
    res: express.Response
  ) => {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'),
      '-',
      tokens['response-time'](req, res),
      'ms'
    ].join(' ');
  }
);
