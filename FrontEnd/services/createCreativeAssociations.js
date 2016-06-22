'use strict';

var rp = require('request-promise');
import { API_PATH } from './apiPath.js';

var createCreativeAssociations = (function (settings, creativeArray, sizes, lineitems) {

	var options = {
	    method: 'POST',
	    uri: API_PATH + 'createCreativeAssociations',
	    form: {
		    network_code: settings.network_code,
		    app_name: settings.app_name,
		    client_secret: settings.client_secret,
		    client_id: settings.client_id,
		    refresh_token: settings.refresh_token,
		    creatives: creativeArray,
		    sizes: sizes,
		    line_items: lineitems
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

module.exports = createCreativeAssociations;