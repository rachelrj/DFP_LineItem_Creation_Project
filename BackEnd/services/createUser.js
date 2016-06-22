'use strict';
var get_service = require('../util/getService.js');

var createUser = (function (settings) {

	var Promise = require("bluebird");

	var Dfp = Promise.promisifyAll(require('node-google-dfp')),
	    dfpUser = new Dfp.User(settings.network_code, settings.app_name, "v201511");

	dfpUser.setSettings({
	    client_id: settings.client_id,
	    client_secret: settings.client_secret,
	    refresh_token: settings.refresh_token,
	    redirect_url: "urn:ietf:wg:oauth:2.0:oob",
	});

	return get_service('UserService', dfpUser)
		.then(function(service) {
			return service.getCurrentUserAsync();
		}).then(function(resp) {
			return resp.rval;
		});

});

module.exports = createUser;