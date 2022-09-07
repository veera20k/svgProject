var needle = require('needle');

module.exports.doServiceGetCall = function (url,options) {
	return new Promise(function (resolve, reject) {
		needle.get(url, options, function (err, response, body) {
			if (err) {
				return reject(err);
			}
			else {
				return resolve(response);
			}
		});
	});
}

module.exports.doServicePostCall = function (url, data) {
	return new Promise(function (resolve, reject) {
		needle.post(url, data, function (err, response, body) {
			if (err) {
				return reject(err);
			}
			else {
				return resolve(response);
			}
		});
	});
}
