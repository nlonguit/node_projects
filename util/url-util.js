/**
 * Created by nlong on 4/3/2016.
 */
var urlParts  = require('url');


exports.buildUrl = function (req) {
    return urlParts.format({
        protocol: req.protocol,
        host: req.get('host'),
        slashes: true
    })
};

exports.getParam = function(req, param) {
    var query = urlParts.parse(req.url,true).query;
    console.log('query: ' + JSON.stringify((query)));
    var value = query[param];
    return value;
}
