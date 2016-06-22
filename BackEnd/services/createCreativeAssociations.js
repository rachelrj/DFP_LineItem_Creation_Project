'use strict';
var get_service = require('../util/getService.js');
var getResponseResults = function (resp) {
		return (resp && resp.rval && resp.rval.results) || [];		
};

//TODO: Send 50 associations at a time so DFP doesnt crap out.
var createCreativeAssociations = (function (settings, creatives, sizes, lineitems) {

	var Promise = require("bluebird");

	var Dfp = Promise.promisifyAll(require('node-google-dfp')),
	    dfpUser = new Dfp.User(settings.network_code, settings.app_name, "v201511");

	dfpUser.setSettings({
	    client_id: settings.client_id,
	    client_secret: settings.client_secret,
	    refresh_token: settings.refresh_token,
	    redirect_url: "urn:ietf:wg:oauth:2.0:oob",
	});

	var assocs = [];
	var pql_pairs = [];
	var pql_delete_pairs = [];

	for(var i = 0; i < lineitems.length; i++) {
		for (var j = 0; j < creatives.length; j++) {

			var associationSizes = [];
			for(var k = 0; k < sizes.length; k++){
				var size = {};

				size['width'] = sizes[k].width;
				size['height'] = sizes[k].height;
				size['isAspectRatio'] = false;
				associationSizes.push(size);
			}

			assocs.push({	lineItemId: lineitems[i],
			   				creativeId: creatives[j],
			   				sizes: associationSizes
			   			});
			pql_pairs.push("(lineItemId = " + lineitems[i] +
			   " AND creativeId = " + creatives[j] + ")");			
		}
		pql_delete_pairs.push("(lineItemId = " + lineitems[i]
					+ " AND not creativeId in ("
					+ creatives.join(",") + "))");
	}

	if (assocs.length == 0)
		return lineitems;

	return get_service('LineItemCreativeAssociationService', dfpUser)
	.then(function(service) {
		var del_stmt = "where status != 'INACTIVE' and (" + pql_delete_pairs.join(" OR ") + ")";

		service.performLineItemCreativeAssociationActionAsync({
			lineItemCreativeAssociationAction: { attributes: { 'xsi:type': 'DeleteLineItemCreativeAssociations' }},
			filterStatement: { query: del_stmt }});

		var stmt = new Dfp.Statement("where status != 'INACTIVE' and (" + pql_pairs.join(" OR ") + ")");

		return service.getLineItemCreativeAssociationsByStatementAsync(stmt)
		.then(function(resp) {
			var li_bmp = {};

			var existing_li_list = getResponseResults(resp);

			for (var i = 0; i < existing_li_list.length; i++) {
				var li = existing_li_list[i];
				li_bmp[li.lineItemId + ":" + li.creativeId] = true;
			}

			return service.createLineItemCreativeAssociationsAsync({
				lineItemCreativeAssociations: assocs.filter(function(o) {
					return !li_bmp[o.lineItemId + ":" + o.creativeId];
				})
			});
		});
	});
});

module.exports = createCreativeAssociations;