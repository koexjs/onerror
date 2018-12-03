import * as Koa from 'koa';
import * as request from 'supertest';
import { get, post } from '@zcorky/koa-router';
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
});
