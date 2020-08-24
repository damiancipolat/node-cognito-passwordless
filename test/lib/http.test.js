//Include unit testing libs.
const chai = require('chai');

describe('http lib - test', ()=>{

  it('isHttpError - 200',()=>{

    const {
      isHttpError
    } = require('../../src/lib/http.js');

    chai.expect(isHttpError(200)).to.be.false;

  });

  it('isHttpError - 400',()=>{

    const {
      isHttpError
    } = require('../../src/lib/http.js');

    chai.expect(isHttpError(400)).to.be.true;

  });

  it('isHttpError - 500',()=>{

    const {
      isHttpError
    } = require('../../src/lib/http.js');

    chai.expect(isHttpError(500)).to.be.true;

  });

  it('isHttpError - null',()=>{

    const {
      isHttpError
    } = require('../../src/lib/http.js');

    chai.expect(isHttpError(null)).to.be.false;

  });

  it('isHttpError - text',()=>{

    const {
      isHttpError
    } = require('../../src/lib/http.js');

    chai.expect(isHttpError('abcdef')).to.be.false;

  });

});