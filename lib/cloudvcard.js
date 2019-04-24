"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var https = require("http");
var CloudVCard = /** @class */ (function () {
    function CloudVCard() {
        this._version = '1.0.0';
        this._apihostname = 'api.cloudvcard.com';
    }
    CloudVCard.prototype.authorize = function (token) {
        var _this = this;
        return this.requestUrl('POST', 'authorization/authorize', { token: token })
            .then(function (result) {
            if (!result || !result.token)
                throw new Error('token missing');
            _this._token = result.token;
            return _this._token;
        });
    };
    CloudVCard.prototype.getVCard = function (ids) {
        if (!this._token)
            throw new Error('authentication required');
        if (!ids || ids.length < 1)
            throw new Error('ids missing');
        return this.requestUrl('GET', 'vcards/get?ids[]=' + ids.join('&ids[]='))
            .then(function (res) {
            return res.result;
        });
    };
    CloudVCard.prototype.requestUrl = function (method, pagerequest, postdata) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var data = JSON.stringify(postdata);
            var options = {
                hostname: _this._apihostname,
                port: 443,
                path: '/' + pagerequest,
                method: method,
                headers: {}
            };
            if (_this._token) {
                options.headers['Authorization'] = 'Bearer ' + _this._token;
            }
            if (postdata) {
                options.headers['Content-Type'] = 'application/json';
                options.headers['Content-Length'] = data.length;
            }
            var request = https.request(options, function (response) {
                if (response.statusCode < 200 || response.statusCode > 299) {
                    reject(new Error('Failed to load page, status code: ' + response.statusCode));
                }
                var body = [];
                response.on('data', function (chunk) { return body.push(chunk); });
                response.on('end', function () { return resolve(body.join('')); });
            });
            if (data)
                request.write(data);
            request.on('error', function (err) { return reject(err); });
            if (!data)
                request.end();
        })
            .then(function (result) {
            return JSON.parse(result);
        })
            .catch(function (err) {
            console.error(err);
        });
    };
    return CloudVCard;
}());
exports.default = CloudVCard;
