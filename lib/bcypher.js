var fs      = require('fs');
var http    = require('http');
var os      = require('os');
var path    = require('path');

var Q       = require('q');
var restler = require('restler');
var protag  = require('protagonist');
var urltpl  = require('url-template');
var streams = require('memory-streams');

const API_VERSION = 'v1';
const URL_ROOT    = 'https://api.blockcypher.com';
const BLUEPRINT   = "blockcypher-api-"+API_VERSION+".md";

// override to force blueprint location
module.exports.blueprint = null;

var coins = {};

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

        // generic function for all resource actions, sets up the right HTTP call using provided
        // arguments and the resource spec
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

// loads the API blueprint by checking a custom location, checking the tmp dir (from a
// past download) or downloading it to tmp
function loadBlueprint() {
  if (module.exports.blueprint) {
    // check custom location
    var bploc = module.exports.blueprint;
  } else {
    // check tmp dir
    var bploc = path.join(os.tmpdir(), BLUEPRINT);
  }
  if (fs.existsSync(bploc)) {
    return Q.nfcall(fs.readFile, bploc);
  }

  // can't find it, going to download it to tmp
  var file      = fs.createWriteStream(bploc);
  var writer    = new streams.WritableStream();
  var deferred  = Q.defer();

  http.get("http://dev.blockcypher.com/"+BLUEPRINT, function(response) {
    response.pipe(file);
    response.pipe(writer);
    file.on('finish', function() {
      file.close(function() { deferred.resolve(writer.toString()); });
    });
  }).on('error', function(err) {
    fs.unlinkSync(bploc);
    deferred.reject(err)
  });
  return deferred.promise;
}

function buildMethodName(resource, action) {
  var method;
  var split = resource.name.split(' ');
  if (split.length > 1 && split[1] == 'Collection') {
    // collection resources
    switch (action.method) {
      case "GET"    : method = "list"; break;
      case "POST"   : method = "create"; break;
      default:
        console.log("Unknown resource method", action.method, "for", resource.name, ", skipping.")
        return
    }
  } else if (split.length > 1) {
    // alternate actions
    method = decapitalize(split[1]);
  } else {
    // item resource
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
