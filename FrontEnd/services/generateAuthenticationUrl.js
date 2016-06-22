'use strict';

var rp = require('request-promise');
import { API_PATH } from './apiPath.js';

var generateURL = (function (creds) {

	var options = {
	    uri: API_PATH + 'authenticationURL',
	    qs: {
	        client_id: creds.client_id,
	        client_secret: creds.client_secret,
	    },
	    json: true // Automatically stringifies the body to JSON 
	};
	 
	return rp(options)
	    .then(function (parsedBody) {
	        return parsedBody;
	    });
	    // .catch(function (err) {
	    // 	//TODO: Improved Logging
	    //     return "Could not create Authentication URL";
	    // });

});

module.exports = generateURL;