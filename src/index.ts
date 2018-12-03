import { Context } from 'koa';

export interface Options {
  log: (method: string, path: string, error: Error | string) => void;
}

const createOnError = (options?: Options) => {
  const getLogger = (ctx: Context) => options && options.log || ((...args: any[]) => ctx.logger ? ctx.logger.error(...args) : console.error(...args));

  return async function onerror(ctx: Context, next: () => Promise<void>) {
    try {
      await next();
    } catch (error) {
      const logger = getLogger(ctx);
      logger(ctx.method, ctx.path, error instanceof Error ? error.stack : error);

      ctx.status = error.status || 500;
      ctx.body = {
        message: error.status ? error.message : 'Internal Server Error',
      };
    }
  };
};

export default createOnError;

export {
  createOnError,
}
