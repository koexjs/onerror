# onerror

[![NPM version](https://img.shields.io/npm/v/@koex/onerror.svg?style=flat)](https://www.npmjs.com/package/@koex/onerror)
[![Coverage Status](https://img.shields.io/coveralls/koexjs/onerror.svg?style=flat)](https://coveralls.io/r/koexjs/onerror)
[![Dependencies](https://img.shields.io/david/koexjs/onerror.svg)](https://github.com/koexjs/onerror)
[![Build Status](https://travis-ci.com/koexjs/onerror.svg?branch=master)](https://travis-ci.com/koexjs/onerror)
![license](https://img.shields.io/github/license/koexjs/onerror.svg)
[![issues](https://img.shields.io/github/issues/koexjs/onerror.svg)](https://github.com/koexjs/onerror/issues)

> onerror for koa extend.

### Install

```
$ npm install @koex/onerror
```

### Usage

```javascript
// See more in test
import onerror from '@koex/onerror';

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
* [koa](https://github.com/koajs/koa)
* [rsshub/onerror](https://github.com/DIYgod/RSSHub/blob/master/middleware/onerror.js)