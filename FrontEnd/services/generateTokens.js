'use strict';

var rp = require('request-promise');

var generateTokens = (function (code, client_id, client_secret) {

	var options = {
	    method: 'POST',
	    uri: 'https://www.googleapis.com/oauth2/v4/token',
	    form: {
		    code: code,
		    client_id: client_id,
		    client_secret: client_secret,
		    redirect_uri: "urn:ietf:wg:oauth:2.0:oob",
		    grant_type: "authorization_code",
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

module.exports = generateTokens;