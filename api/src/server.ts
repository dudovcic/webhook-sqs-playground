import * as http from 'http';
import * as https from 'https';
import * as express from 'express';

export const startServer = async (
  app: express.Express,
  config: config.IConfig
): Promise<http.Server | https.Server> => {
  const server = http.createServer(app);

  server.listen(config.port);
  console.log('server running on port', config.port);

  return server;
};
