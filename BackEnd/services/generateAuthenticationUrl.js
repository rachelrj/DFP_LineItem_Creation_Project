'use strict';

var google = require('googleapis');

var generateURL = (function (client_id, client_secret) {

	var OAuth2 = google.auth.OAuth2;

	var oauth2Client = new OAuth2(
	  client_id,
	  client_secret,
	  "urn:ietf:wg:oauth:2.0:oob"
	);

	var url = oauth2Client.generateAuthUrl({
	   access_type: 'offline',
	   scope: [
	     'https://www.googleapis.com/auth/dfp'
	   ]
	});

	return url;

});

module.exports = generateURL;