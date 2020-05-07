var request = require('superagent');

const URL_ROOT = 'https://api.blockcypher.com/v1/';

/**
 * <b>BlockCypher API Client</b>.
 * @constructor
 * @param {string}    coin    The coin for which you're using the BlockCypher API. Can be 'btc', 'ltc', 'doge', or 'bcy'.
 * @param {string}    chain   The chain for which you're using the BlockCypher API. Can be 'main', 'test', or 'test3'.
 * @param {string}    token   Your BlockCypher API Token.
 */
var Blockcy = function (coin, chain, token) {
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
Blockcy.prototype._get = function (url, params, cb) {
	var urlr = URL_ROOT + this.coin + '/' + this.chain + url;
	params = Object.assign({}, params, { token: this.token });
	request
		.get(urlr)
		.set('Accept', 'application/json')
		.query(params)
		.end(function (error, response) {
			if (error || response.statusCode !== 200) {
				cb(error || {});
			} else {
				cb(null, response.body);
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
Blockcy.prototype._post = function (url, params, data, cb) {
	var urlr = URL_ROOT + this.coin + '/' + this.chain + url;
	params = Object.assign({}, params, { token: this.token });
	request
		.post(urlr)
		.set('Content-Type', 'application/json')
		.query(params)
		.send(data)
		.end(function (error, response) {
			if (error || (response.statusCode !== 200 && response.statusCode !== 201)) {
				cb(error || {});
			} else {
				cb(null, response.body);
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
Blockcy.prototype._del = function (url, params, cb) {
	var urlr = URL_ROOT + this.coin + '/' + this.chain + url;
	params = Object.assign({}, params, { token: this.token });
	request.del({
		url: urlr,
		strictSSL: true,
		json: true,
		qs: params
	}, function (error, response, body) {
		if (error || response.statusCode !== 204) {
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
Blockcy.prototype.getChain = function (cb) {
	this._get('/', {}, function (error, body) {
		cb(error, body);
	});
};

/**
 * <b>Get Block</b>
 * Get info about a block you're querying under your object's coin/chain, with additional parameters. Can use either block height or hash.
 * @param {(string|number)}    hh         Hash or height of the block you're querying.
 * @param {Object}             [params]   Optional URL parameters.
 * @callback cb
 * @memberof Blockcy
 * @method getBlock
 */
Blockcy.prototype.getBlock = function (hh, params, cb) {
	if (typeof params === 'function') {
		cb = params;
		params = {};
	}
	this._get('/blocks/' + hh, params, function (error, body) {
		cb(error, body);
	});
};

/**
 * <b>Get Addr Bal</b>
 * Get balance information about an address.
 * @param {(string|number)}    addr       Address you're querying.
 * @param {Object}             [params]   Optional URL parameters.
 * @callback cb
 * @memberof Blockcy
 * @method getAddrBal
 */
Blockcy.prototype.getAddrBal = function (addr, params, cb) {
	if (typeof params === 'function') {
		cb = params;
		params = {};
	}
	this._get('/addrs/' + addr + '/balance', params, function (error, body) {
		cb(error, body);
	});
};

/**
 * <b>Get Addr</b>
 * Get information about an address, including concise transaction references.
 * @param {(string|number)}    addr       Address you're querying.
 * @param {Object}             [params]   Optional URL parameters.
 * @callback cb
 * @memberof Blockcy
 * @method getAddr
 */
Blockcy.prototype.getAddr = function (addr, params, cb) {
	if (typeof params === 'function') {
		cb = params;
		params = {};
	}
	this._get('/addrs/' + addr, params, function (error, body) {
		cb(error, body);
	});
};

/**
 * <b>Get Addr Full</b>
 * Get information about an address, including full transactions.
 * @param {(string|number)}    addr       Address you're querying.
 * @param {Object}             [params]   Optional URL parameters.
 * @callback cb
 * @memberof Blockcy
 * @method getAddrFull
 */
Blockcy.prototype.getAddrFull = function (addr, params, cb) {
	if (typeof params === 'function') {
		cb = params;
		params = {};
	}
	this._get('/addrs/' + addr + '/full', params, function (error, body) {
		cb(error, body);
	});
};

/**
 * <b>Gen Addr</b>
 * Generates a new address and associate private/public keys.
 * @param {Object}   					data    						Optional JSON data, which could be used for generating multisig addresses, for exampl.JSON data, which could be used for generating multisig addresses, for example.
 * @param {Array[Strings]}    data.pubKeys    		Optional pubKeys for multi sig address
 * @param {String}   					data.script_type    Optional script type for multi sig address
 * @callback cb
 * @memberof Blockcy
 * @method genAddr
 */
Blockcy.prototype.genAddr = function (data, cb) { //TODO Allow function signature genAddr(cb) as well
	this._post('/addrs', {}, data, function (error, body) {
		cb(error, body);
	});
};

/**
 * <b>Faucet</b>
 * Funds an address. Must be used within a test blockchain (bcy-test or btc-test3).
 * @param {string}    addr     Address to be funded.
 * @param {number}    value    Amount to fund.
 * @callback cb
 * @memberof Blockcy
 * @method faucet
 */
Blockcy.prototype.faucet = function (addr, value, cb) { //TODO set default value if value is undefined/null. Maybe allow faucet(addr, cb).
	this._post('/faucet', {}, { address: addr, amount: value }, function (error, body) {
		cb(error, body);
	});
};

/**
 * <b>Create Wallet</b>
 * Creates a new wallet.
 * @param {Object}    				data    					JSON Data used to create wallet.
 * @param {String}    				data.name    			Name of wallet
 * @param {Array[String]}     data.addresses    Array of addresses
 * @callback cb
 * @memberof Blockcy
 * @method createWallet
 */
Blockcy.prototype.createWallet = function (data, cb) { //TODO check if they have name and address before making request
	this._post('/wallets', {}, data, function (error, body) {
		cb(error, body);
	});
};

/**
 * <b>Create HD Wallet</b>
 * Creates a new HD wallet.
 * @param {Object}     		 data    											JSON Data used to create HD wallet.
 * @param {String}     		 data.name    								Name of wallet
 * @param {String}     		 data.extended_public_key    	extended public key
 * @param {Array[int]}     data.subchain_indexes    		subchain indexes
 * @callback cb
 * @memberof Blockcy
 * @method createHDWallet
 */
Blockcy.prototype.createHDWallet = function (data, cb) { //TODO error validation on name and extended_public_key
	this._post('/wallets/hd', {}, data, function (error, body) {
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
Blockcy.prototype.listWallets = function (cb) {
	this._get('/wallets', {}, function (error, body) {
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
Blockcy.prototype.listHDWallets = function (cb) {
	this._get('/wallets/hd', {}, function (error, body) {
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
Blockcy.prototype.getWallet = function (name, cb) {
	this._get('/wallets/' + name, {}, function (error, body) {
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
Blockcy.prototype.getHDWallet = function (name, cb) {
	this._get('/wallets/hd/' + name, {}, function (error, body) {
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
Blockcy.prototype.addAddrWallet = function (name, addrs, cb) {
	this._post('/wallets/' + name + '/addresses', {}, { addresses: addrs }, function (error, body) {
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
Blockcy.prototype.getAddrsWallet = function (name, cb) {
	this._get('/wallets/' + name + '/addresses', {}, function (error, body) {
		cb(error, body);
	});
};

/**
 * <b>Get Addresses from HD Wallet</b>
 * Get array of addresses from named HD wallet.
 * @callback cb
 * @param {string}     name    Name of the HD wallet you're querying.
 * @param {Object}     [params]  Optional URL parameters.
 * @memberof Blockcy
 * @method getAddrsHDWallet
 */
Blockcy.prototype.getAddrsHDWallet = function (name, params, cb) {
	if (typeof params === 'function') {
		cb = params;
		params = {};
	}
	this._get('/wallets/hd/' + name + '/addresses', params, function (error, body) {
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
Blockcy.prototype.delAddrsWallet = function (name, addrs, cb) {
	this._del('/wallets/' + name + '/addresses', { address: addrs.join([';']) }, function (error, body) {
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
Blockcy.prototype.genAddrWallet = function (name, cb) {
	this._post('/wallets/' + name + '/addresses/generate', {}, {}, function (error, body) {
		cb(error, body);
	});
};

/**
 * <b>Derive Address in Wallet</b>
 * Derive an address in named HD wallet.
 * @callback cb
 * @param {string}     name      Name of the wallet you're querying.
 * @param {Object}     [params]  Optional URL parameters.
 * @memberof Blockcy
 * @method deriveAddrHDWallet
 */
Blockcy.prototype.deriveAddrHDWallet = function (name, params, cb) {
	if (typeof params === 'function') {
		cb = params;
		params = {};
	}
	this._post('/wallets/hd/' + name + '/addresses/derive', params, {}, function (error, body) {
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
Blockcy.prototype.delWallet = function (name, cb) {
	this._del('/wallets/' + name, {}, function (error, body) {
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
Blockcy.prototype.delHDWallet = function (name, cb) {
	this._del('/wallets/hd/' + name, {}, function (error, body) {
		cb(error, body);
	});
};

/**
 * <b>Get Transaction</b>
 * Get transaction by hash.
 * @callback cb
 * @param {string}    hash    Hash of the transaction.
 * @param {Object}    params  Optional URL parameters.
 * @memberof Blockcy
 * @method getTX
 */
Blockcy.prototype.getTX = function (hash, params, cb) { //TODO allow params to be optional getTX(hash, cb) should work
	this._get('/txs/' + hash, params, function (error, body) {
		cb(error, body);
	});
};

/**
 * <b>Get Unconfirmed Transactions</b>
 * Get currently unconfirmed transactions.
 * @callback cb
 * @memberof Blockcy
 * @method getUnTXs
 */
Blockcy.prototype.getUnTXs = function (cb) {
	this._get('/txs', {}, function (error, body) {
		cb(error, body);
	});
};

/**
 * <b>New Transaction</b>
 * Creates a new transaction skeleton, which returns the transaction along with data that needs to be signed. You can see more information on how this process works here: <a href="http://dev.blockcypher.com/?javascript#creating-transactions">http://dev.blockcypher.com/?javascript#creating-transactions</a>
 * @callback cb
 * @param {Object}     tx      Transaction base you're using to build a TX. https://www.blockcypher.com/dev/bitcoin/#tx
 * @memberof Blockcy
 * @method newTX
 */
Blockcy.prototype.newTX = function (tx, cb) {
	this._post('/txs/new', {}, tx, function (error, body) {
		cb(error, body);
	});
};

/**
 * <b>Send Transaction</b>
 * Sends a signed transaction skeleton, which returns the completed transaction. You can read more information on how this process works here: <a href="http://dev.blockcypher.com/?javascript#creating-transactions">http://dev.blockcypher.com/?javascript#creating-transactions</a>
 * @callback cb
 * @param {Object}     txskel     Signed transaction skeleton you're sending. https://www.blockcypher.com/dev/bitcoin/#txskeleton
 * @memberof Blockcy
 * @method sendTX
 */
Blockcy.prototype.sendTX = function (txskel, cb) {
	this._post('/txs/send', {}, txskel, function (error, body) {
		cb(error, body);
	});
};

/**
 * <b>Push Transaction</b>
 * Pushes a raw, hex-serialized transaction.
 * @callback cb
 * @param {string}     hex     Hex-encoded transaction.
 * @memberof Blockcy
 * @method pushTX
 */
Blockcy.prototype.pushTX = function (hex, cb) {
	this._post('/txs/push', {}, { tx: hex }, function (error, body) {
		cb(error, body);
	});
};

/**
 * <b>Decode Transaction</b>
 * Decodes (but doesn't send!) a hex-serialized raw transaction. Useful for debugging issues with pushTX.
 * @callback cb
 * @param {string}     hex     Hex-encoded transaction.
 * @memberof Blockcy
 * @method pushTX
 */
Blockcy.prototype.decodeTX = function (hex, cb) {
	this._post('/txs/decode', {}, { tx: hex }, function (error, body) {
		cb(error, body);
	});
};

/**
 * <b>Embed Transaction</b>
 * Embeds data within a given blockchain.
 * @callback cb
 * @param {string}     hex     Hex-encoded data to embed.
 * @memberof Blockcy
 * @method pushTX
 */
Blockcy.prototype.embedData = function (hex, cb) {
	this._post('/txs/data', {}, { data: hex }, function (error, body) {
		cb(error, body);
	});
};

/**
 * <b>Send Micro Transaction</b>
 * Sends a transaction using private (or public) keys via the microtransaction API, as described here: <a href="http://dev.blockcypher.com/?javascript#microtransaction-endpoint">http://dev.blockcypher.com/?javascript#microtransaction-endpoint</a>
 * @callback cb
 * @param {Object}     micro    Microtransaction object.
 * @memberof Blockcy
 * @method microTX
 */
Blockcy.prototype.microTX = function (micro, cb) {
	this._post('/txs/micro', {}, micro, function (error, body) {
		cb(error, body);
	});
};

/**
 * <b>Get Transaction Confidence</b>
 * Get transaction confidence by hash.
 * @callback cb
 * @param {string}    hash    Hash of the transaction.
 * @memberof Blockcy
 * @method getTXConf
 */
Blockcy.prototype.getTXConf = function (hash, cb) {
	this._get('/txs/' + hash + '/confidence', {}, function (error, body) {
		cb(error, body);
	});
};

/**
 * <b>Create Payment Forward</b>
 * Creates a new payment forward.
 * @param {Object}    data    							JSON Data used to create payment forward.
 * @param {String}    data.destination    	Destination address
 * @param {String}    data.callback_url    	callback url
 * @callback cb
 * @memberof Blockcy
 * @method createPayFwd
 */
Blockcy.prototype.createPayFwd = function (data, cb) {
	this._post('/payments', {}, data, function (error, body) {
		cb(error, body);
	});
};

/**
 * <b>List Payment Forwards</b>
 * Lists current payments associated with this blockchain and token.
 * @callback cb
 * @memberof Blockcy
 * @method listPayFwds
 */
Blockcy.prototype.listPayFwds = function (cb) {
	this._get('/payments', {}, function (error, body) {
		cb(error, body);
	});
};

/**
 * <b>Delete Payment Forward</b>
 * Deletes payment forward by id.
 * @callback cb
 * @param {string}      id    ID of the payment forward you're deleting.
 * @memberof Blockcy
 * @method delPayFwd
 */
Blockcy.prototype.delPayFwd = function (id, cb) {
	this._del('/payments/' + id, {}, function (error, body) {
		cb(error, body);
	});
};

/**
 * <b>Create WebHook</b>
 * Creates a new webhook.
 * @param {Object}    data    				JSON Data used to create webhook.
 * @param {String}    data.event    	Event name
 * @param {String}    data.address    address
 * @param {String}    data.url    		url
 * @callback cb
 * @memberof Blockcy
 * @method createHook
 */
Blockcy.prototype.createHook = function (data, cb) {
	this._post('/hooks', {}, data, function (error, body) {
		cb(error, body);
	});
};

/**
 * <b>List WebHooks</b>
 * Lists current webhooks associated with this blockchain and token.
 * @callback cb
 * @memberof Blockcy
 * @method listHooks
 */
Blockcy.prototype.listHooks = function (cb) {
	this._get('/hooks', {}, function (error, body) {
		cb(error, body);
	});
};

/**
 * <b>Get WebHook</b>
 * Get information about a WebHook based on its ID.
 * @param {string}    id    ID of the WebHook you're querying.
 * @callback cb
 * @memberof Blockcy
 * @method getHook
 */
Blockcy.prototype.getHook = function (id, cb) {
	this._get('/hooks/' + id, {}, function (error, body) {
		cb(error, body);
	});
};

/**
 * <b>Delete WebHook</b>
 * Deletes WebHook by its id.
 * @callback cb
 * @param {string}      id    ID of the WebHook you're deleting.
 * @memberof Blockcy
 * @method delPayFwd
 */
Blockcy.prototype.delHook = function (id, cb) {
	this._del('/hooks/' + id, {}, function (error, body) {
		cb(error, body);
	});
};
