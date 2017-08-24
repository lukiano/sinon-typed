import * as sinon from 'sinon';

export interface Mock<T> {
  readonly control: sinon.SinonMock;
  readonly object: T;
}

export interface SinonPropertyStub<U> {
  returns(value: U): void;
}

export interface Stub<T> {
  readonly object: T;
  readonly stub: StubT<T>;
  stubMethod(method: keyof T): sinon.SinonStub;
  stubProperty<K extends keyof T>(property: K): SinonPropertyStub<T[K]>;
}

export type StubT<T> = {
  [P in keyof T]: sinon.SinonStub;
};

export class SinonTyped {

  static mock<T extends object>(sandbox?: sinon.SinonSandbox): Mock<T> {
    return new MockImpl<T>(sandbox);
  }

  static stub<T extends object>(sandbox?: sinon.SinonSandbox): Stub<T> {
    return new StubImpl<T>(sandbox);
  }

  static partiallyStub<T extends object>(partial: Partial<T>, sandbox?: sinon.SinonSandbox): Stub<T> {
    const stubT = SinonTyped.stub<T>(sandbox);
    Object.keys(partial).map((key) => stubT.stubProperty(key as keyof T).returns(partial[key]));
    return stubT;
  }

  static partially<T extends object>(partial: Partial<T>, sandbox?: sinon.SinonSandbox): T {
    return SinonTyped.partiallyStub<T>(partial, sandbox).object;
  }

}

class MockImpl<T extends object> implements Mock<T> {

  public readonly object: T;

  public readonly control: sinon.SinonMock;

  constructor(_sandbox?: sinon.SinonSandbox) {
    this.object = <T>{};
    if (_sandbox) {
      this.control = _sandbox.mock(this.object);
    } else {
      this.control = sinon.mock(this.object);

    }

    const expects: (s: String) => sinon.SinonExpectation = this.control.expects;

    // creates a dummy method before mocking it.
    this.control.expects = (method: keyof T) => {
      if (!this.object.hasOwnProperty(method)) {
        const dummy: () => void = () => undefined;
        this.object[method] = dummy;
      }
      return expects.bind(this.control)(method);
    };
  }

}

class StubImpl<T extends object> implements Stub<T> {

  public readonly object: T = <T>{};

  public readonly stub: StubT<T> = <StubT<T>>{};

  constructor(private readonly _sandbox?: sinon.SinonSandbox) { }

  public stubMethod(method: keyof T): sinon.SinonStub {
    if (!this.stub.hasOwnProperty(method)) {
      const dummy: () => void = () => undefined;
      this.object[method] = dummy;
      this.stub[method] = this._stub(method);
    }
    return this.stub[method];
  }

  public stubProperty<K extends keyof T>(property: K): SinonPropertyStub<T[K]> {
    if (this.stub.hasOwnProperty(property)) {
      this.stub[property].resetBehavior();
    }
    this.object[property] = undefined;
    if (this._sandbox) {
      return {
        returns: (value: T[K]) => {
          this.stub[property] = this._sandbox!.stub(this.object, property).value(value);
        }
      };
    } else {
      return {
        returns: (value: T[K]) => {
          this.stub[property] = sinon.stub(this.object, property);
          this.stub[property].value(value);
        }
      };
    }
  }

  private _stub(method: keyof T): sinon.SinonStub {
    if (this._sandbox) {
      return this._sandbox.stub(this.object, method);
    }
    return sinon.stub(this.object, method);
  }
}
