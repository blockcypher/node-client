node-client
===========

Node.js SDK for the BlockCypher Web services. See http://www.blockcypher.com

Examples
--------

```javascript
var bcypher = require('blockcypher-node');

function printResponse(err, data) {
  if (err != nil) {
    console.log(err);
  } else {
    console.log(data);
  }
}

bcypher("btc", "main", "[TOKEN]", function(api) {
  api.blocks.get(100, printResponse);
  api.addresses.get('1DEP8i3QJCsomS4BSMY2RpU1upv62aGvhD', printResponse);
  api.addresses.balance('1DEP8i3QJCsomS4BSMY2RpU1upv62aGvhD', printResponse);
  api.payments.create({'destination': 'mtWg6ccLiZWw2Et7E5UqmHsYgrAi5wqiov'}, printResponse);
});

```
