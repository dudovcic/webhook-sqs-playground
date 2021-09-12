import * as express from 'express';
import * as bodyParser from 'body-parser';
import routes from './routes';
import { IServices } from './services';
import { reqLogger } from './middleware/request-logger';

export const createApp = async (
  config: config.IConfig,
  services: IServices
): Promise<express.Express> => {
  const app: express.Express = express();

  app.set('port', config.port);
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(reqLogger);
  routes(app, config, services);

  return app;
};
