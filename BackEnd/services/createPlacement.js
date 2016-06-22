'use strict';
var get_service = require('../util/getService.js');

var createPlacement = (function (settings, placementName) {

	var Promise = require("bluebird");

	var Dfp = Promise.promisifyAll(require('node-google-dfp')),
	    dfpUser = new Dfp.User(settings.network_code, settings.app_name, "v201511");

	dfpUser.setSettings({
	    client_id: settings.client_id,
	    client_secret: settings.client_secret,
	    refresh_token: settings.refresh_token,
	    redirect_url: "urn:ietf:wg:oauth:2.0:oob",
	});

	var getResponseResults = function (resp) {
		return (resp && resp.rval && resp.rval.results) || [];		
	};

	var inv_tgts_from_list = function(ls) {
		return { targetedPlacementIds: ls };
	};
	
	return get_service('PlacementService', dfpUser)
		.then(function(service) {
				var pql = "where name in (" + "'" + placementName + "'" + ")";
				var statement = new Dfp.Statement(pql);
				return service.getPlacementsByStatementAsync(statement);
		}).then(function(resp) {

				if(!resp.rval.totalResultSetSize || resp.rval.totalResultSetSize === 0){
					return "Error obtaining the placement. Please check the inv_targeting specified.";
				}

				var results = getResponseResults(resp);

				return inv_tgts_from_list(results.map(
					function(p) { 
						return p.id; 
					}
				));
		});
});

module.exports = createPlacement;