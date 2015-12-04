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
 * @callback cb
 * @memberof Blockcy
 * @method getBlock
 */
Blockcy.prototype.getBlock = function(hh, cb) {
	this._get('/blocks/' + hh,{}, function(error, body) {
		cb(error, body);
	});
};

/**
 * <b>Get Block Custom</b>
 * Get info about a block you're querying under your object's coin/chain, with additional URL parameters. Can use either block height or hash.
 * @param {(string|number)}    hh         Hash or height of the block you're querying.
 * @param {?number}            txstart    Optional parameter to filter response to only include txids after txstart in the block.
 * @param {?limit}             limit      Optional parameter to filter response to limit the amount of txids returned in the block.
 * @callback cb
 * @memberof Blockcy
 * @method getBlock
 */
Blockcy.prototype.getBlockCustom = function(hh, txstart, limit, cb) {
	this._get('/blocks/' + hh,{txstart:txstart, limit:limit}, function(error, body) {
		cb(error, body);
	});
};
