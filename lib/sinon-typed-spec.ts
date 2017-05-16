import * as sinon from 'sinon';
import { expect } from 'chai';
import { SinonTyped, Mock } from './sinon-typed';

interface Test {
  aProperty: number;
  aMethod(v1: string): string;
}

describe('SinonTyped', () => {

  describe('mock', () => {

    it('mocks methods', () => {
      const testMock: Mock<Test> = SinonTyped.mock<Test>();
      const expectation = testMock.control.expects('aMethod').withArgs('value1').once();
      expectation.returns('result1');
      const result = testMock.object.aMethod('value1');
      expect(result).to.equals('result1');
      expectation.verify();
    });

    it('mocks methods when on a sandbox', () => {
      const sandbox = sinon.sandbox.create();
      const testMock: Mock<Test> = SinonTyped.mock<Test>(sandbox);
      const expectation = testMock.control.expects('aMethod').withArgs('value1').once();
      expectation.returns('result1');
      expect(testMock.object.aMethod('value1')).to.equals('result1');
      expectation.verify();
      sandbox.restore();
      expect(testMock.object.aMethod('value1')).to.equals(undefined);
    });

  });

  describe('stub', () => {

    it('stub methods', () => {
      const testStub = SinonTyped.stub<Test>();
      testStub.stubMethod('aMethod')
        .withArgs('value2').returns('result2')
        .withArgs('value3').returns('result3');
      expect(testStub.object.aMethod('value2')).to.equals('result2');
      expect(testStub.object.aMethod('value3')).to.equals('result3');
    });

    it('stub methods when on a sandbox', () => {
      const sandbox = sinon.sandbox.create();
      const testStub = SinonTyped.stub<Test>(sandbox);
      testStub.stubMethod('aMethod')
        .withArgs('value2').returns('result2')
        .withArgs('value3').returns('result3');
      expect(testStub.object.aMethod('value2')).to.equals('result2');
      expect(testStub.object.aMethod('value3')).to.equals('result3');
      sandbox.restore();
      expect(testStub.object.aMethod('value2')).to.equals(undefined);
      expect(testStub.object.aMethod('value3')).to.equals(undefined);
    });

    it('stub properties', () => {
      const testStub = SinonTyped.stub<Test>();
      testStub.stubProperty('aProperty').returns(42);
      expect(testStub.object.aProperty).to.equals(42);
    });

    it('stub properties when on a sandbox', () => {
      const sandbox = sinon.sandbox.create();
      const testStub = SinonTyped.stub<Test>(sandbox);
      testStub.stubProperty('aProperty').returns(42);
      expect(testStub.object.aProperty).to.equals(42);
      sandbox.restore();
      expect(testStub.object.aProperty).to.equals(undefined);
    });

  });

});
