import { createApp } from './app';
import { startServer } from './server';
require('dotenv').config();
import config from './config';
import { createServices } from './services';

(async (): Promise<void> => {
  const services = createServices(config);

  const app = await createApp(config, services);

  await startServer(app, config);
})();
