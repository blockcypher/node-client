'use strict';
const chai = require('chai');
const sinon = require('sinon');
const sinonTest = require('sinon-test');
var test = sinonTest(sinon);
const expect = require('chai').expect;
let request = require('superagent');



let BlockCypher = require('../../lib/bcypher');
let chain = 'btc';
let network = 'main';
let token = process.env.TOKEN;
let bcapi = new BlockCypher(chain, network, token);

/*
describe('Blockcypher _post Method: ', function () {

  it('should return success statusCode 200 and return data', test(function (done) {
    let post = this.spy(bcapi._post).bind(bcapi);
    let validReturn = { data: { key1: 'value', key2: 2 } };
    let inputBody = { data: {} };

    this.stub(request, 'post').yields(null, { statusCode: 200 }, validReturn);
    bcapi._post('/', {}, inputBody, function (e, r) {

      var callArgs = request.post.getCall(0).args[0];
      expect(callArgs.qs).to.deep.equal({ token: token });
      expect(callArgs.strictSSL).to.equal(true);
      expect(callArgs.json).to.equal(true);
      expect(callArgs.body).to.deep.equal(inputBody);
      expect(Object.keys(callArgs).length).to.equal(5);

      expect(e).to.equal(null);
      expect(r).to.deep.equal(validReturn);
      done();
    });
  }));

  it('should return success statusCode 201 and return data', test(function (done) {
    let post = this.spy(bcapi._post).bind(bcapi);
    let validReturn = { data: { key1: 'value', key2: 2 } };
    let inputBody = { data: {} };

    this.stub(request, 'post').yields(null, { statusCode: 201 }, validReturn);
    bcapi._post('/', {}, inputBody, function (e, r) {

      var callArgs = request.post.getCall(0).args[0];
      expect(callArgs.qs).to.deep.equal({ token: token });
      expect(callArgs.strictSSL).to.equal(true);
      expect(callArgs.json).to.equal(true);
      expect(callArgs.body).to.deep.equal(inputBody);
      expect(Object.keys(callArgs).length).to.equal(5);

      expect(e).to.equal(null);
      expect(r).to.deep.equal(validReturn);
      done();
    });
  }));


  it('should return error and empty data when response body is null', test(function (done) {
    let post = this.spy(bcapi._post).bind(bcapi);
    let badRequestError = "Bad Request";
    let inputBody = { data: {} };

    this.stub(request, 'post').yields(badRequestError, { statusCode: 400 });
    bcapi._post('/', {}, inputBody, function (e, r) {

      var callArgs = request.post.getCall(0).args[0];
      expect(callArgs.qs).to.deep.equal({ token: token });
      expect(callArgs.strictSSL).to.equal(true);
      expect(callArgs.json).to.equal(true);
      expect(callArgs.body).to.deep.equal(inputBody);
      expect(Object.keys(callArgs).length).to.equal(5);

      expect(e).to.equal(badRequestError);
      expect(r).to.deep.equal({});
      done();
    });
  }));

  it('should return error and data when response body exists', test(function (done) {
    let post = this.spy(bcapi._post).bind(bcapi);
    let badRequestError = "Bad Request";
    let badRequestData = { message: 'badRequeset' };
    let inputBody = { data: {} };

    this.stub(request, 'post').yields(badRequestError, { statusCode: 400 }, badRequestData);
    bcapi._post('/', {}, inputBody, function (e, r) {

      var callArgs = request.post.getCall(0).args[0];
      expect(callArgs.qs).to.deep.equal({ token: token });
      expect(callArgs.strictSSL).to.equal(true);
      expect(callArgs.json).to.equal(true);
      expect(callArgs.body).to.deep.equal(inputBody);
      expect(Object.keys(callArgs).length).to.equal(5);

      expect(e).to.equal(badRequestError);
      expect(r).to.deep.equal(badRequestData);
      done();
    });
  }));

});//end of _post
*/