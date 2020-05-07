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


describe('Blockcypher listHDWallets Method: ', function () {

  it('should return success', test(function (done) {

    let validEndpoint = '/wallets/hd';
    let params = {};

    let validReturn = { data: { key1: 'value', key2: 2 } };
    this.stub(bcapi, '_get').yields(null, validReturn);
    bcapi.listHDWallets(function (e, r) {

      var callArgs = bcapi._get.getCall(0).args;
      expect(callArgs[0]).to.equal(validEndpoint);
      expect(callArgs[1]).to.deep.equal(params);
      expect(typeof callArgs[2]).to.equal('function');
      expect(Object.keys(callArgs).length).to.equal(3);

      expect(e).to.equal(null);
      expect(r).to.deep.equal(validReturn);
      done();
    });
  }));


  it('should return error', test(function (done) {
    let validReturn = {};
    let validEndpoint = '/wallets/hd';

    let badRequestError = "Bad Request";
    this.stub(bcapi, '_get').yields(badRequestError, null);
    bcapi.listHDWallets(function (e, r) {

      var callArgs = bcapi._get.getCall(0).args;
      expect(callArgs[0]).to.equal(validEndpoint);
      expect(callArgs[1]).to.deep.equal({});
      expect(typeof callArgs[2]).to.equal('function');
      expect(Object.keys(callArgs).length).to.equal(3);

      expect(e).to.equal(badRequestError);
      expect(r).to.deep.equal(null);
      done();
    });
  }));

});//end of listHDWallets
