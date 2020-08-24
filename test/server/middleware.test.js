//Include unit testing libs.
const chai       = require('chai');
const proxyquire = require('proxyquire');
const sinon      = require('sinon');

//Add chai as promise.
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

describe('middlweares - test', ()=>{

  it('errorHandler', ()=>{

    const {
      errorHandler
    } = require('../../src/server/middleware.js');

    const error = {
      statusCode:500,
      message:'Mocked error'
    };

    const jsonStub = sinon.spy();

    const res = {
      status:sinon.fake.returns({
        json:jsonStub
      })
    };

    errorHandler(error,null, res, null);
    chai.expect(jsonStub.firstCall.args[0]).to.eql({ status: 502, message: 'Mocked error' });

  });
  
  it('errorHandler - 500', ()=>{

    const {
      errorHandler
    } = require('../../src/server/middleware.js');

    const error = {
      message:'Mocked error'
    };

    const jsonStub = sinon.spy();

    const res = {
      status:sinon.fake.returns({
        json:jsonStub
      })
    };

    errorHandler(error,null, res, null);
    chai.expect(jsonStub.firstCall.args[0]).to.eql({ status: 500, message: 'Mocked error' });

  });
  
  it('errorHandler - no message', ()=>{

    const {
      errorHandler
    } = require('../../src/server/middleware.js');

    const error = {};

    const jsonStub = sinon.spy();

    const res = {
      status:sinon.fake.returns({
        json:jsonStub
      })
    };

    errorHandler(error,null, res, null);
    chai.expect(jsonStub.firstCall.args[0]).to.eql({ status: 500, message: 'Internal server Error' });

	});


});