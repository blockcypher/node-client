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


describe('Blockcypher delPayFwd Method: ', function () {


  describe('Success: ', function () {

    it('When id exists', test(function (done) {

      let id = 'myName';
      let validParams = {};
      let validEndpoint = '/payments/' + id;

      let validReturn = { data: { key1: 'value', key2: 2 } };
      this.stub(bcapi, '_del').yields(null, validReturn);
      bcapi.delPayFwd(id, function (e, r) {

        var callArgs = bcapi._del.getCall(0).args;
        expect(callArgs[0]).to.equal(validEndpoint);
        expect(callArgs[1]).to.deep.equal(validParams);
        expect(typeof callArgs[2]).to.equal('function');
        expect(Object.keys(callArgs).length).to.equal(3);

        expect(e).to.equal(null);
        expect(r).to.deep.equal(validReturn);
        done();
      });
    }));

  });//end of success cases;

  describe('Errors: ', function () {

    it('bubbles up error when _del returns error', test(function (done) {

      let id = 'myName';
      let validParams = {};
      let badRequestError = "Bad Request";
      let validEndpoint = '/payments/' + id;


      let validReturn = { data: { key1: 'value', key2: 2 } };
      this.stub(bcapi, '_del').yields(badRequestError, validReturn);
      bcapi.delPayFwd(id, function (e, r) {

        var callArgs = bcapi._del.getCall(0).args;
        expect(callArgs[0]).to.equal(validEndpoint);
        expect(callArgs[1]).to.deep.equal(validParams);
        expect(typeof callArgs[2]).to.equal('function');
        expect(Object.keys(callArgs).length).to.equal(3);

        expect(e).to.equal(badRequestError);
        expect(r).to.deep.equal(validReturn);
        done();
      });
    }));

    it.skip('When id is null/undefined', function (done) { done(); }); //TODO Error out when id does not exist

  });//end of error cases;



});//end of delPayFwd
