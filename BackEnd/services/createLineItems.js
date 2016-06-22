'use strict';
var get_service = require('../util/getService.js');
var build_line_item = require('../util/buildLineItem.js');
var get_create_custom_criteria = require('../util/get_create_custom_criteria.js');
var sendLineItems = require('./sendLineItems.js');

var build_criteria = (function(cpm) {
	var hbpb = (Number(cpm*0.01)).toFixed(2);
	return { hb_pb: hbpb }
});

var createLineItems = (function (settings, start_cpm, end_cpm, advertiser_name, order_id, sizes, placement) {

	var Promise = require("bluebird");

	var Dfp = Promise.promisifyAll(require('node-google-dfp')),
	    dfpUser = new Dfp.User(settings.network_code, settings.app_name, "v201511");

	dfpUser.setSettings({
	    client_id: settings.client_id,
	    client_secret: settings.client_secret,
	    refresh_token: settings.refresh_token,
	    redirect_url: "urn:ietf:wg:oauth:2.0:oob",
	});

	var line_items = [];
	var criteria = {};

	for(var i=start_cpm; i<=end_cpm; i++){
		var name = advertiser_name + " " + (i / 100);
		var c = build_criteria(i);
		line_items.push(build_line_item(order_id, name, i, sizes, { custom_crit: c}, 'USD', Dfp));

			for (var key in c) {
				var val = c[key];

				if (!criteria[key])
					criteria[key] = [val];
				else if (criteria[key].indexOf(val) == -1)
					criteria[key].push(val);
			}
	}

	return get_create_custom_criteria(criteria, dfpUser, Dfp)
	.then(function(custom_targets) {
		line_items.forEach(function(li) {
			
			li['targeting']['inventoryTargeting'] = placement;

			var cc = li['custom_crit'];
			if (!cc)
				return;

			var children = [];
			for (var cc_key in cc)
				children.push({ attributes: { 'xsi:type': 'CustomCriteria' },
								keyId: custom_targets[cc_key]['__ID__'],
								valueIds: [ custom_targets[cc_key][cc[cc_key]] ],
								operator: 'IS',
							  });
			delete li['custom_crit'];
			li['targeting']['customTargeting'] = {
				logicalOperator: 'OR',
				children: [{
					attributes: { 'xsi:type': 'CustomCriteriaSet' },
					logicalOperator: 'AND',
					children: children,
				}]
			};

		});

		return sendLineItems(line_items, dfpUser, Dfp, order_id);		
	});

});

module.exports = createLineItems;