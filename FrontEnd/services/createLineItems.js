'use strict';

var rp = require('request-promise');
import { API_PATH } from './apiPath.js';

var createLineItems = (function (settings, start, end, advertiserName, orderId, sizes, placement) {

	var options = {
	    method: 'POST',
	    uri: API_PATH + 'createLineItems',
	    form: {
		    network_code: settings.network_code,
		    app_name: settings.app_name,
		    client_secret: settings.client_secret,
		    client_id: settings.client_id,
		    refresh_token: settings.refresh_token,
		    start_cpm: start,
		    end_cpm: end,
		    advertiser_name: advertiserName,
		    order_id: orderId,
		    sizes: sizes,
		    placement: placement
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

module.exports = createLineItems;