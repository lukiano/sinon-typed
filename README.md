# Sinon Typed [![Build Status](https://travis-ci.org/lukiano/sinon-typed.svg?branch=master)](https://travis-ci.org/lukiano/sinon-typed) [![Coverage Status](https://coveralls.io/repos/github/lukiano/sinon-typed/badge.svg?branch=master)](https://coveralls.io/github/lukiano/sinon-typed?branch=master)
```bash
npm install --save-dev sinon
npm install --save-dev @types/sinon
npm install --save-dev sinon-typed
```
## Usage

```typescript
import * as assert from 'assert';
import {SinonTyped} from 'sinon-typed';

interface Test {
  aProperty: number;
  aMethod(arg: string): string;
}

const testStub = SinonTyped.stub<Test>();
testStub.stubMethod('aMethod').withArgs('value').returns('result');
testStub.stubProperty('aProperty').returns(42);
const test = testStub.object;
assert.equal(test.aMethod('value'), 'result');
assert.equal(test.aProperty, 42);
```
