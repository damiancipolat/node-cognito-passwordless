//Include unit testing libs.
const chai       = require('chai');
const proxyquire = require('proxyquire');
const sinon      = require('sinon');

//Add chai as promise.
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

describe('notFound controller - test', ()=>{

  it('notFound controller', async ()=>{

    const health  = proxyquire('../../../src/server/controller/not-found.js',{
      'pino':()=>({
        info:sinon.fake.returns('')
      })
    });

    const jsonStub = sinon.spy();

    const req = {
      headers:{
        'x-forwarded-for':'127.0.0.1'
      },      
      url:'mock.com',
      method:'GET'
    };

    const res = {
      status:sinon.fake.returns({
        json:jsonStub
      })
    };

    health(req,res,null,false);
    chai.expect(jsonStub.firstCall.args[0]).to.eql({"error":"Route not found."});

  });
  
});