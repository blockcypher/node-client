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
var BlockCypher = function(coin, chain, token) {
	this.coin = coin;
	this.chain = chain;
	this.token = token;
};

module.exports = BlockCypher;

/**
 * <b>Helper for GET calls</b>
 * 
 * @private
 * @param {string}    url        Endpoint after URL_ROOT.
 * @param {Object}    params     Additional URL parameters.
 * @callback          cb
 * @memberof          BlockCypher
 * @method            get
 */
BlockCypher.prototype._get = function(url, params, cb) {
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
