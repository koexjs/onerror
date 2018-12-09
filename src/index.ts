import { Context } from 'koa';

export interface InvalidateError {
  code: string;
  field: string;
  message: string;
}

export interface Options {
  type?: 'json' | 'template';
  template?: (status: number, message: string, code: string, errors?: InvalidateError[]) => string;
  log?: (method: string, path: string, error: Error | string) => void;
}

const createOnError = (options?: Options) => {
  const type = options && options.type || 'json';
  const template = options && options.template;
  const log = options && options.log;

  const getLogger = (ctx: Context) =>
    ((...args: any[]) =>
      log
        ? (log as any)(...args)
        : ctx.logger
          ? ctx.logger.error(...args)
          : console.error(...args));

  return async function onerror(ctx: Context, next: () => Promise<void>) {
    try {
      await next();
    } catch (error) {
      // log
      const logger = getLogger(ctx);
      logger(ctx.method, ctx.path, error instanceof Error ? error.stack : error);
    
      const status = error.status || 500;
      const message = error.status ? error.message : 'Internal Server Error';
      const code = error.code;
      const errors = error.errors;

      ctx.status = status;

      if (type === 'template') {
        ctx.body = template ? template(status, message, code, errors) : error.message;
      } else {
        ctx.body = {
          code,
          message,
          errors,
        };
      }
    }
  };
};

export default createOnError;

export {
  createOnError,
}
