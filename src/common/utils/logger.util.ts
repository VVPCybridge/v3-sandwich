import { pino } from 'pino';
import pretty from 'pino-pretty';

const stream = pretty({
  colorize: true,
  ignore: 'pid,hostname',
  // hideObject: false,
  levelFirst: true,
  translateTime: 'mm/dd HH:MM:ss o',
  customPrettifiers: {
    caller: (caller) => `${caller}`,
  },
});

export const pinoForLogger = pino(
  {
    enabled: process.env.NODE_ENV !== 'test',
    serializers: {
      err: (e) => ({
        type: e.type,
        message: e.message,
        stack: e.stack,
      }),
    },
  },
  stream,
);

class Logger {
  private _logger: pino.Logger;

  constructor() {
    this._logger = pinoForLogger;
  }

  warn(message: string, ...args: unknown[]) {
    return this._logger.warn(args, message);
  }

  debug(message: string, ...args: unknown[]) {
    return this._logger.debug(args, message);
  }

  info(message: string, ...args: unknown[]) {
    return this._logger.info(args, message);
  }

  /**
   *
   * @param err - new Error()
   * @returns
   */
  error(err: Error, msg?: string) {
    return this._logger.error({ err }, msg);
  }
}

export const logger = new Logger();
