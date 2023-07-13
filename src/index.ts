/* eslint-disable @typescript-eslint/no-explicit-any */

import { App } from '@app/app';
import { logger } from './common';

const bootstrap = async () => {
  process.on('unhandledRejection', (reason: any, promise: any) => {
    logger.error(reason, promise);
  });

  process.on('uncaughtException', (error: Error, source: any) => {
    logger.error(error, source);
  });

  try {
    const app = new App();
    await app.init();
    app.run();
  } catch (err: any) {
    logger.error(err, '[Bootstrap] init error');
  }
};
bootstrap();
