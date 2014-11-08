var fs      = require('fs');
var os      = require('os');
var path    = require('path');

var Q       = require('q');
var restler = require('restler');
var protag  = require('protagonist');
var urltpl  = require('url-template');

const API_VERSION = 'v1';
const URL_ROOT    = 'https://api.blockcypher.com';
const BLUEPRINT   = "blockcypher-api-"+API_VERSION+".md";

var coins     = {};
var blueprint = null;

// Main API entry point, returns an object exposing all our endpoints
function coin(name, chain, token, cb) {
  if (!chain) chain = "main";
  if (typeof token == "function") {
    cb = token;
    token = null;
  }

  // memoized
  fullyQual = name+"."+chain;
  if (coins[fullyQual]) {
    return cb(null, coins[fullyQual]);
  }

  // deferred allows us to both return a promise if some want to us that and
  // invoke the callback if provided
  var deferred = Q.defer();
  deferred.promise
    .then(loadBlueprint)
    .then(parseBlueprint)
    .then(function(bp) { return genApi(name.toLowerCase(), chain, token, bp); })
    .then(function(coinapi) { coins[fullyQual] = coinapi; return coinapi; })
    .then(Q.denodeify(cb))
    .done();
  deferred.resolve();
  return deferred.promise;
}

// generates an api object with sub-objects for each resource, each having functions
// for our methods/actions
function genApi(name, chain, token, blueprint) {
  var api = {};
  blueprint.ast.resourceGroups.forEach(function(rg) {
    rg.resources.forEach(function(res) {
      var baseName  = res.name.split(' ')[0];
      var apiname   = pluralize(decapitalize(baseName));
      api[apiname]  = api[apiname] || {};
      var resObj    = api[apiname];
      var resUrlTpl = urltpl.parse(res.uriTemplate);

      res.actions.forEach(function(action) {
        var method = buildMethodName(res, action);
        if (!method) return;

        resObj[method] = function() {
          var callback, data, query;
          var args = Array.prototype.slice.call(arguments);
          if (typeof args[args.length-1] == 'function') {
            callback = args.pop();
          }
          if (typeof args[args.length-1] == 'object') {
            data = args.pop();
          }
          if (data && action.method == "GET") {
            query = data;
            data  = null;
          }
          if (token) {
            query = query || {};
            query.token = token;
          }

          var obj = {coin: name, chain: chain, token: token};
          res.parameters.forEach(function(param, idx) {
            if (args[idx]) { obj[param.name] = args[idx]; }
          });
          var url = resUrlTpl.expand(obj);
          var response = restler.request(URL_ROOT + url, {
            headers: {'Content-Type': 'application/json'},
            method  : action.method,
            query   : query,
            data    : JSON.stringify(data)
          });
          if (callback) {
            response.on('success', function(data) { callback(null, data); });
            response.on('fail', function(data) {
              data = JSON.parse(data);
              callback(new Error(data.error || data.errors), null);
            });
            response.on('error', function(err) { callback(err, null); });
          }
        }
      });
    });
  });
  return api;
}

function parseBlueprint(blueprint) {
  return Q.nfcall(protag.parse, blueprint.toString());
}

function loadBlueprint() {
  // check tmp dir
  var tmploc = path.join(os.tmpdir(), BLUEPRINT);
  if (fs.existsSync(tmploc)) {
    return Q.nfcall(fs.readFile, tmploc);
  }
  // TODO download
  // TODO load from custom file location
  return null;
}

function buildMethodName(resource, action) {
  var method;
  var split = resource.name.split(' ');
  if (split.length > 1 && split[1] == 'Collection') {
    switch (action.method) {
      case "GET"    : method = "list"; break;
      case "POST"   : method = "create"; break;
      default:
        console.log("Unknown resource method", action.method, "for", resource.name, ", skipping.")
        return
    }
  } else if (split.length > 1) {
    method = decapitalize(split[1]);
  } else {
    switch (action.method) {
      case "GET"    : method = "get"; break;
      case "DELETE" : method = "remove"; break;
      case "PUT"    : method = "update"; break;
      default:
        console.log("Unknown resource method", action.method, "for", resource.name, ", skipping.")
        return
    }
  }
  return method
}

function pluralize(str) {
  if (str[str.length-1] == "s") {
    return str+"es";
  } else {
    return str + 's';
  }
}

function decapitalize(str) {
  return str[0].toLowerCase() + str.substring(1);
}

module.exports = coin;
