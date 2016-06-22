'use strict';

var rp = require('request-promise');
import { API_PATH } from './apiPath.js';

var getPlacement = (function (settings, placementName) {

	var options = {
	    method: 'POST',
	    uri: API_PATH + 'createPlacement',
	    form: {
		    network_code: settings.network_code,
		    app_name: settings.app_name,
		    client_secret: settings.client_secret,
		    client_id: settings.client_id,
		    refresh_token: settings.refresh_token,
		    placement_name: placementName
	    },
	    json: true
	};

	return rp(options)
	    .then(function (parsedBody) {
	        return parsedBody;
	    }, function (err) {
	    	return err.error;
	    });

});

module.exports = getPlacement;