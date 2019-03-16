import * as Koa from 'koa';
import * as request from 'supertest';
import * as bodyParser from 'koa-body';
import * as Joi from 'joi';
import joi from '@koex/joi';
import { get, post } from '@koex/router';
import 'should';

import onerror from '../src';

describe('koa onerror', () => {
  describe('without options', () => {
    const app = new Koa();

    app.use(onerror());

    app.use(get('/', (ctx) => {
      throw new Error('error');
    }));

    app.use(post('/', (ctx) => {
      const error = new Error('Unauthorized');
      (error as any).status = 401;
      throw error;
    }));

    it('should throw default', async () => {
      await request(app.listen())
        .get('/')
        .set('accept', '*/*')
        .expect(500, { message: 'Internal Server Error' });
    });

    it('should throw custom error', async () => {
      await request(app.listen())
        .post('/')
        .expect(401, { message: 'Unauthorized' });
    });
  });

  describe('with options', () => {
    const app = new Koa();

    app.use(onerror({
      log(method, path, error) {
        method.should.equal('GET');
        path.should.equal('/');
        // error.should.equal('error');
      },
    }));

    app.use(get('/', (ctx) => {
      throw new Error('error');
    }));

    it('should throw default', async () => {
      await request(app.listen())
        .get('/')
        .expect(500, { message: 'Internal Server Error' });
    });
  });

  describe('with koa joi', () => {
    const app = new Koa();

    app.use(onerror({
      log(method, path, error) {
        method.should.equal('POST');
        path.should.equal('/');
        // error.should.equal('error');
      },
    }));

    app.use(bodyParser())
    app.use(joi());

    app.use(post('/',
      async (ctx, next) => {
        console.log('post');
        await ctx.validate({
          name: Joi.string(),
        }, ctx.request.body);

        await next();
      }, async (ctx) => {
        ctx.body = '123';
      }));

    it('should throw', async () => {
      await request(app.listen())
        .post('/')
        .send({ name: 123 })
        .expect(422, {
          code: 'invalid_param',
          message: 'Validation Failed',
          // detail: JSON.parse(JSON.stringify(Joi.validate({ name: Joi.string() }, { name: 123 }))).error,
          detail: {
            _object: {
              name: 123,
            },
            details: [{
              context: {
                key: 'name',
                label: 'name',
                value: 123,
              },
              message: '"name" must be a string',
              path: [
                'name',
              ],
              type: 'string.base',
            }],
            isJoi: true,
            name: 'ValidationError',
          },
        });
    });
  });
});
