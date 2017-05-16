# Sinon Typed

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
