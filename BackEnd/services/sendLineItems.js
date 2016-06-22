//TODO: move into services. this isnt really a util

'use strict';
var get_service = require('../util/getService.js');
var generic_get_create = require('../util/generic_get_create.js');
var util = require('util');

var returnTemplate = function() {
	return {
					orderId: 0,
					id: 0,
					name: '',
					startDateTime: 0,
					startDateTimeType: 'IMMEDIATELY',
					unlimitedEndDateTime: true,
					lineItemType: 'PRICE_PRIORITY',
					costPerUnit: 0,
					costType: 'CPM',
					creativePlaceholders: 0,
					disableSameAdvertiserCompetitiveExclusion: true,
					primaryGoal: { goalType: 'NONE', unitType: 'IMPRESSIONS', units: '-1' },
					targeting: {},
				};
};

var sendLineItems = function(line_items, dfpUser, Dfp) {

	var li_dict = {};
	var li_names = [];
	line_items.forEach(function(li) { 
		li_dict[li.name] = li;
		li_names.push(li.name);
	});

	return get_service('LineItemService', dfpUser)
		.then(function(service) {
			return generic_get_create(
				function(pql) {
					var stmt = new Dfp.Statement(pql +" and orderId = " + line_items[0].orderId + " and isArchived = false");
					return service.getLineItemsByStatementAsync(stmt);
				}, function(lis_to_add) {
					return service.createLineItemsAsync({ lineItems: lis_to_add });
				}, function(name) {
					return li_dict[name];
				}, li_names
			).then(function(old_new_lis) {
				var new_line_items = [];
				
				for (var line_name in old_new_lis) {

					//Using the line item template maintains order of items within object.
					//DFP requires specific order within Line Item requests
					var template = returnTemplate();
					var line_item = util._extend(template, li_dict[line_name]);
					line_item['id'] = old_new_lis[line_name].id;
					line_item['orderId'] = old_new_lis[line_name].orderId;
					var status = old_new_lis[line_name].status;
					if (status == 'DELIVERING' || status == 'READY' || status == 'PAUSED') {
						line_item['startDateTime'] = old_new_lis[line_name]['startDateTime'];
						line_item['startDateTimeType'] = old_new_lis[line_name]['startDateTimeType'];
					}
					new_line_items.push(line_item);
				}
				return service.updateLineItemsAsync({ lineItems: new_line_items });
			});
		});
};

module.exports = sendLineItems;