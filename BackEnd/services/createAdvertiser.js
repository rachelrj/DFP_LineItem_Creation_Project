'use strict';
var get_service = require('../util/getService.js');
var check_for_error_type = require ('../util/check_for_error_type.js');

var createAdvertiser = (function (settings, advertiserName) {

	var Promise = require("bluebird");

	var Dfp = Promise.promisifyAll(require('node-google-dfp')),
	    dfpUser = new Dfp.User(settings.network_code, settings.app_name, "v201511");

	dfpUser.setSettings({
	    client_id: settings.client_id,
	    client_secret: settings.client_secret,
	    refresh_token: settings.refresh_token,
	    redirect_url: "urn:ietf:wg:oauth:2.0:oob",
	});

	return get_service('CompanyService', dfpUser)
	.then(function(service) {
		var statement = new Dfp.Statement("where name = '" + advertiserName + "'");

		return service.getCompaniesByStatementAsync(statement)
		.then(function(resp) {
			var results = resp.rval.results || [];

			if (results.length) {
				return results[0];
			}

			return service.createCompaniesAsync({ companies: [{name: advertiserName, type: 'ADVERTISER'}]})
				.then(function(resp) {
					return resp.rval[0];
				});
			});
		})
	.catch(function(err) {
		return check_for_error_type(err);
	});
});

module.exports = createAdvertiser;