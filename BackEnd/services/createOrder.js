'use strict';
var get_service = require('../util/getService.js');

var createOrder = (function (settings, orderName, advertiserId, userId) {

	var Promise = require("bluebird");

	var Dfp = Promise.promisifyAll(require('node-google-dfp')),
	    dfpUser = new Dfp.User(settings.network_code, settings.app_name, "v201511");

	dfpUser.setSettings({
	    client_id: settings.client_id,
	    client_secret: settings.client_secret,
	    refresh_token: settings.refresh_token,
	    redirect_url: "urn:ietf:wg:oauth:2.0:oob",
	});

	return get_service('OrderService', dfpUser)
		.then(function(service) {
			var filter = '';
			filter = "where name = '" + orderName + "'";
			var statement = new Dfp.Statement(filter);

			return service.getOrdersByStatementAsync(statement)
				.then(function(resp) {
					var results = resp.rval.results || [];
					if (results.length) {
						if(advertiserId != results[0].advertiserId){
							return "Advertiser specified does not match order.";
						}
						return results[0];
					}
					return service.createOrdersAsync({ orders: [{
						name: orderName,
						advertiserId: advertiserId,
						traffickerId: userId,
					}]})
					.then(function(resp) {
							return resp.rval[0];
					});
				});
		});

});

module.exports = createOrder;