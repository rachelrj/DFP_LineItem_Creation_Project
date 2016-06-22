'use strict';

var getSettings = (function (req) {

	var settings = {};

	settings.network_code = req.body.network_code;
	settings.app_name = req.body.app_name;
	settings.client_id = req.body.client_id;
	settings.client_secret = req.body.client_secret;
	settings.refresh_token = req.body.refresh_token;
	settings.redirect_uri = "urn:ietf:wg:oauth:2.0:oob";

	return settings;

});

module.exports = getSettings;