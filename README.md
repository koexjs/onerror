# koa-onerror

[![NPM version](https://img.shields.io/npm/v/@zcorky/koa-onerror.svg?style=flat)](https://www.npmjs.com/package/@zcorky/koa-onerror)
[![Coverage Status](https://img.shields.io/coveralls/zcorky/koa-onerror.svg?style=flat)](https://coveralls.io/r/zcorky/koa-onerror)
[![Dependencies](https://david-dm.org/@zcorky/koa-onerror/status.svg)](https://david-dm.org/@zcorky/koa-onerror)
[![Build Status](https://travis-ci.com/zcorky/koa-onerror.svg?branch=master)](https://travis-ci.com/zcorky/koa-onerror)
![license](https://img.shields.io/github/license/zcorky/koa-onerror.svg)
[![issues](https://img.shields.io/github/issues/zcorky/koa-onerror.svg)](https://github.com/zcorky/koa-onerror/issues)

> Simple OnError for Koa

### Install

```
$ npm install @zcorky/koa-onerror
```

### Usage

```javascript
// See more in test
import onerror from '@zcorky/koa-onerror';

import * as Koa from 'koa';
const app = new Koa();

app.use(onerror());

// fallback
app.use(async (ctx) => {
  const error = new Error('Unauthorized');
  (error as any).status = 401;
  throw error;
});

app.listen(8000, '0.0.0.0', () => {
  console.log('koa server start at port: 8000');
});
```

### Related
* [rsshub/onerror](https://github.com/DIYgod/RSSHub/blob/master/middleware/onerror.js)