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


describe('Blockcypher sendTX Method: ', function () {


  describe('Success: ', function () {

    it('When txskel exist', test(function (done) {

      let txskel = {}; //TODO make actual txskel

      let validData = txskel;
      let params = {};
      let validEndpoint = '/txs/send';

      let validReturn = { data: { key1: 'value', key2: 2 } };
      this.stub(bcapi, '_post').yields(null, validReturn);
      bcapi.sendTX(txskel, function (e, r) {

        var callArgs = bcapi._post.getCall(0).args;
        expect(callArgs[0]).to.equal(validEndpoint);
        expect(callArgs[1]).to.deep.equal(params);
        expect(callArgs[2]).to.deep.equal(validData);
        expect(typeof callArgs[3]).to.equal('function');
        expect(Object.keys(callArgs).length).to.equal(4);

        expect(e).to.equal(null);
        expect(r).to.deep.equal(validReturn);
        done();
      });
    }));

  });//end of success cases;

  describe('Errors: ', function () {

    it('bubbles up error when _post returns error', test(function (done) {

      let txskel = {}; //TODO make actual txskel
      let validData = txskel;
      let params = {};
      let badRequestError = "Bad Request";
      let validEndpoint = '/txs/send';


      let validReturn = { data: { key1: 'value', key2: 2 } };
      this.stub(bcapi, '_post').yields(badRequestError, validReturn);
      bcapi.sendTX(txskel, function (e, r) {

        var callArgs = bcapi._post.getCall(0).args;
        expect(callArgs[0]).to.equal(validEndpoint);
        expect(callArgs[1]).to.deep.equal(params);
        expect(callArgs[2]).to.deep.equal(validData);
        expect(typeof callArgs[3]).to.equal('function');
        expect(Object.keys(callArgs).length).to.equal(4);

        expect(e).to.equal(badRequestError);
        expect(r).to.deep.equal(validReturn);
        done();
      });
    }));

    it.skip('When tx is null/undefined', function (done) { done(); }); //TODO Error out when tx does not exist

  });//end of error cases;



});//end of sendTX
