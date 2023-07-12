/* eslint-disable @typescript-eslint/no-explicit-any */
import { config } from '@common/config';
import { logger } from './common';

const bootstrap = async () => {
  process.on('unhandledRejection', (reason: any, promise: any) => {
    logger.error(reason, promise);
  });

  process.on('uncaughtException', (error: Error, source: any) => {
    logger.error(error, source);
  });
  logger.info(config.nodeEnv);
  process.stdin.resume();
};

bootstrap();
