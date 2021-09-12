import { Application } from 'express';
import * as bills from './bills';
import { IServices } from '../services';
import { unauthRequestHandlerBuilder } from './utils/route-utils';

const routesConfig = (
  app: Application,
  config: config.IConfig,
  services: IServices
): void => {
  const unauthRequest = unauthRequestHandlerBuilder(config, services);
  app.use('/bills', bills.routes(unauthRequest));
};

export default routesConfig;
