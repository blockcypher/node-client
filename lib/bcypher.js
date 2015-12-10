var request = require('request');
var xtend = require('xtend');

const URL_ROOT = 'https://api.blockcypher.com/v1/';

/**
 * <b>BlockCypher API Client</b>.
 * @constructor
 * @param {string}    coin    The coin for which you're using the BlockCypher API. Can be 'btc', 'ltc', 'doge', or 'bcy'.
 * @param {string}    chain   The chain for which you're using the BlockCypher API. Can be 'main', 'test', or 'test3'.
 * @param {string}    token   Your BlockCypher API Token.
 */
var Blockcy = function(coin, chain, token) {
	this.coin = coin;
	this.chain = chain;
	this.token = token;
};

module.exports = Blockcy;

/**
 * <b>Helper for GET calls</b>
 * 
 * @private
 * @param {string}    url        Endpoint after URL_ROOT.
 * @param {Object}    params     Additional URL parameters.
 * @callback          cb
 * @memberof          Blockcy
 * @method            get
 */
Blockcy.prototype._get = function(url, params, cb) {
	var getter = URL_ROOT + this.coin + '/' + this.chain + url;
	params = xtend(params, {token:this.token});
	request.get({
		url:getter,
		strictSSL:true,
		json: true,
		qs: params
	}, function (error, response, body) {
		if (!error || response.statusCode !== 200) {
			cb(error, body || {});
		} else {
			cb(null, body);
		}
	});
};

/**
 * <b>Helper for POST calls</b>
 * 
 * @private
 * @param {string}    url        Endpoint after URL_ROOT.
 * @param {Object}    params     Optional additional URL parameters.
 * @param {Object}    data       Optional data to post.
 * @callback          cb
 * @memberof          Blockcy
 * @method            post
 */
Blockcy.prototype._post = function(url, params, data, cb) {
	var getter = URL_ROOT + this.coin + '/' + this.chain + url;
	params = xtend(params, {token:this.token});
	request.post({
		url:getter,
		strictSSL:true,
		json: true,
		qs: params,
		body: data 
	}, function (error, response, body) {
		if (!error || response.statusCode !== 200) {
			cb(error, body || {});
		} else {
			cb(null, body);
		}
	});
};

/**
 * <b>Get Chain</b>
 * Get info about the blockchain you're querying.
 * @callback cb
 * @memberof Blockcy
 * @method getChain
 */
Blockcy.prototype.getChain = function(cb) {
	this._get('/',{}, function(error, body) {
		cb(error, body);
	});
};

/**
 * <b>Get Block</b>
 * Get info about a block you're querying under your object's coin/chain, with additional parameters. Can use either block height or hash.
 * @param {(string|number)}    hh         Hash or height of the block you're querying.
 * @param Object               params     Optional URL parameters.
 * @callback cb
 * @memberof Blockcy
 * @method getBlock
 */
Blockcy.prototype.getBlock = function(hh, params, cb) {
	this._get('/blocks/' + hh, params, function(error, body) {
		cb(error, body);
	});
};

/**
 * <b>Get Addr Bal</b>
 * Get balance information about an address.
 * @param {(string|number)}    addr       Address you're querying.
 * @param Object               params     Optional URL parameters.
 * @callback cb
 * @memberof Blockcy
 * @method getAddrBal
 */
Blockcy.prototype.getAddrBal = function(addr, params, cb) {
	this._get('/addrs/' + addr + '/balance', params, function(error, body) {
		cb(error, body);
	});
};

/**
 * <b>Get Addr</b>
 * Get information about an address, including concise transaction references.
 * @param {(string|number)}    addr       Address you're querying.
 * @param Object               params     Optional URL parameters.
 * @callback cb
 * @memberof Blockcy
 * @method getAddr
 */
Blockcy.prototype.getAddr = function(addr, params, cb) {
	this._get('/addrs/' + addr, params, function(error, body) {
		cb(error, body);
	});
};

/**
 * <b>Get Addr Full</b>
 * Get information about an address, including full transactions.
 * @param {(string|number)}    addr       Address you're querying.
 * @param Object               params     Optional URL parameters.
 * @callback cb
 * @memberof Blockcy
 * @method getAddrFull
 */
Blockcy.prototype.getAddrFull = function(addr, params, cb) {
	this._get('/addrs/' + addr + '/full', params, function(error, body) {
		cb(error, body);
	});
};

/**
 * <b>Gen Addr</b>
 * Generates a new address and associate private/public keys.
 * @param Object               data     Optional JSON data, which could be used for generating multisig addresses, for exampl.JSON data, which could be used for generating multisig addresses, for example.
 * @callback cb
 * @memberof Blockcy
 * @method genAddr
 */
Blockcy.prototype.genAddr = function(data, cb) {
	this._post('/addrs', {}, data, function(error, body) {
		cb(error, body);
	});
};
