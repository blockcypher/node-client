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
	var urlr = URL_ROOT + this.coin + '/' + this.chain + url;
	params = xtend(params, {token:this.token});
	request.get({
		url:urlr,
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
	var urlr = URL_ROOT + this.coin + '/' + this.chain + url;
	params = xtend(params, {token:this.token});
	request.post({
		url:urlr,
		strictSSL:true,
		json: true,
		qs: params,
		body: data 
	}, function (error, response, body) {
		if (!error || (response.statusCode !== 200 && response.statusCode !== 201)) {
			cb(error, body || {});
		} else {
			cb(null, body);
		}
	});
};

/**
 * <b>Helper for DELETE calls</b>
 *
 * @private
 * @param {string}    url        Endpoint after URL_ROOT.
 * @param {Object}    params     Additional URL parameters.
 * @callback          cb
 * @memberof          Blockcy
 * @method            get
 */
Blockcy.prototype._del = function(url, params, cb) {
	var urlr = URL_ROOT + this.coin + '/' + this.chain + url;
	params = xtend(params, {token:this.token});
	request.del({
		url:urlr,
		strictSSL:true,
		json: true,
		qs: params
	}, function (error, response, body) {
		if (!error || response.statusCode !== 204) {
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
 * @param {Object}             params     Optional URL parameters.
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
 * @param {Object}             params     Optional URL parameters.
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
 * @param {Object}             params     Optional URL parameters.
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
 * @param {Object}             params     Optional URL parameters.
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
 * @param {Object}   data    Optional JSON data, which could be used for generating multisig addresses, for exampl.JSON data, which could be used for generating multisig addresses, for example.
 * @callback cb
 * @memberof Blockcy
 * @method genAddr
 */
Blockcy.prototype.genAddr = function(data, cb) {
	this._post('/addrs', {}, data, function(error, body) {
		cb(error, body);
	});
};

/**
 * <b>Create Wallet</b>
 * Creates a new wallet.
 * @param {Object}    data    JSON Data used to create wallet.
 * @callback cb
 * @memberof Blockcy
 * @method createWallet
 */
Blockcy.prototype.createWallet = function(data, cb) {
	this._post('/wallets', {}, data, function(error, body) {
		cb(error, body);
	});
};

/**
 * <b>Create HD Wallet</b>
 * Creates a new HD wallet.
 * @param {Object}    data    JSON Data used to create HD wallet.
 * @callback cb
 * @memberof Blockcy
 * @method createHDWallet
 */
Blockcy.prototype.createHDWallet = function(data, cb) {
	this._post('/wallets/hd', {}, data, function(error, body) {
		cb(error, body);
	});
};

/**
 * <b>List Wallets</b>
 * List wallets under token.
 * @callback cb
 * @memberof Blockcy
 * @method listWallets
 */
Blockcy.prototype.listWallets = function(cb) {
	this._get('/wallets', {}, function(error, body) {
		cb(error, body);
	});
};

/**
 * <b>List HD Wallets</b>
 * List HD wallets under token.
 * @callback cb
 * @memberof Blockcy
 * @method listHDWallets
 */
Blockcy.prototype.listHDWallets = function(cb) {
	this._get('/wallets/hd', {}, function(error, body) {
		cb(error, body);
	});
};

/**
 * <b>Get Wallet</b>
 * Get named wallet.
 * @callback cb
 * @param {string}    name    Name of the wallet you're querying.
 * @memberof Blockcy
 * @method getWallet
 */
Blockcy.prototype.getWallet = function(name, cb) {
	this._get('/wallets/' + name, {}, function(error, body) {
		cb(error, body);
	});
};

/**
 * <b>Get HD Wallet</b>
 * Get named HD wallet.
 * @callback cb
 * @param {string}    name    Name of the HD wallet you're querying.
 * @memberof Blockcy
 * @method getHDWallet
 */
Blockcy.prototype.getHDWallet = function(name, cb) {
	this._get('/wallets/hd/' + name, {}, function(error, body) {
		cb(error, body);
	});
};

/**
 * <b>Add Addresses to Wallet</b>
 * Add array of addresses to named wallet.
 * @callback cb
 * @param {string}     name    Name of the wallet you're querying.
 * @param {string[]}   addrs   Array of addresses you're adding. 
 * @memberof Blockcy
 * @method addAddrWallet
 */
Blockcy.prototype.addAddrWallet = function(name, addrs, cb) {
	this._post('/wallets/' + name + '/addresses', {}, {addresses:addrs}, function(error, body) {
		cb(error, body);
	});
};

/**
 * <b>Get Addresses from Wallet</b>
 * Get array of addresses from named wallet.
 * @callback cb
 * @param {string}     name    Name of the wallet you're querying.
 * @memberof Blockcy
 * @method getAddrsWallet
 */
Blockcy.prototype.getAddrsWallet = function(name, cb) {
	this._get('/wallets/' + name + '/addresses', {}, function(error, body) {
		cb(error, body);
	});
};

/**
 * <b>Get Addresses from HD Wallet</b>
 * Get array of addresses from named HD wallet.
 * @callback cb
 * @param {string}     name    Name of the HD wallet you're querying.
 * @memberof Blockcy
 * @method getAddrsHDWallet
 */
Blockcy.prototype.getAddrsHDWallet = function(name, cb) {
	this._get('/wallets/hd/' + name + '/addresses', {}, function(error, body) {
		cb(error, body);
	});
};

/**
 * <b>Delete Addresses from Wallet</b>
 * Delete addresses from named wallet.
 * @callback cb
 * @param {string}      name    Name of the wallet you're querying.
 * @param {string[]}    addrs   Array of addresses you're deleting.
 * @memberof Blockcy
 * @method delAddrsWallet
 */
Blockcy.prototype.delAddrsWallet = function(name, addrs, cb) {
	this._del('/wallets/' + name + '/addresses', {address:addrs.join([';'])}, function(error, body) {
		cb(error, body);
	});
};

/**
 * <b>Generate Address in Wallet</b>
 * Add a generated address to named wallet.
 * @callback cb
 * @param {string}     name    Name of the wallet you're querying.
 * @memberof Blockcy
 * @method genAddrWallet
 */
Blockcy.prototype.genAddrWallet = function(name, cb) {
	this._post('/wallets/' + name + '/addresses/generate', {}, {}, function(error, body) {
		cb(error, body);
	});
};

/**
 * <b>Derive Address in Wallet</b>
 * Derive an address in named HD wallet.
 * @callback cb
 * @param {string}     name      Name of the wallet you're querying.
 * @param {Object}     params    Optional URL parameters. 
 * @memberof Blockcy
 * @method deriveAddrHDWallet
 */
Blockcy.prototype.deriveAddrHDWallet = function(name, params, cb) {
	this._post('/wallets/hd/' + name + '/addresses/derive', params, {}, function(error, body) {
		cb(error, body);
	});
};

/**
 * <b>Delete Wallet</b>
 * Deletes named wallet.
 * @callback cb
 * @param {string}      name    Name of the wallet you're querying.
 * @memberof Blockcy
 * @method delWallet
 */
Blockcy.prototype.delWallet = function(name, cb) {
	this._del('/wallets/' + name, {}, function(error, body) {
		cb(error, body);
	});
};

/**
 * <b>Delete HD Wallet</b>
 * Deletes named HD wallet.
 * @callback cb
 * @param {string}      name    Name of the HD wallet you're querying.
 * @memberof Blockcy
 * @method delHDWallet
 */
Blockcy.prototype.delHDWallet = function(name, cb) {
	this._del('/wallets/hd/' + name, {}, function(error, body) {
		cb(error, body);
	});
};
