![Node.js CI](https://github.com/blockcypher/node-client/workflows/Node.js%20CI/badge.svg)

node-client
===========

Node.js SDK for the BlockCypher Web services. See [https://www.blockcypher.com/dev/bitcoin/](https://www.blockcypher.com/dev/bitcoin/) for detailed documentation.

To install, just use npm:

```bash
npm install blockcypher
```

Examples
--------

```javascript
bcypher = require('blockcypher');

var bcapi = new bcypher('btc','main',process.env.TOKEN);

function printResponse(err, data) {
  if (err !== null) {
    console.log(err);
  } else {
    console.log(data);
  }
}

//get chain info
bcapi.getChain(printResponse);
//get block height without any optional URL params
bcapi.getBlock(300000, printResponse);
//get block height with an optional "txstart" param, as outlined in docs here: http://dev.blockcypher.com/
bcapi.getBlock(300000, {txstart:2}, printResponse);

//let's try a post request, like making a new webhook
var webhook = {
	event: "unconfirmed-tx",
	address: "15qx9ug952GWGTNn7Uiv6vode4RcGrRemh",
	url: "https://my.domain.com/callbacks/new-tx"
};
bcapi.createHook(webhook, printResponse);

//Now let's list all of our webhooks
bcapi.listHooks(printResponse);
```
