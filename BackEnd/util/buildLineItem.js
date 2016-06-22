'use strict';
// useful for formatting output
var util = require('util');

var convertSizeArraytoCreativePlaceholdersObject = function (sizesArray) {
		var size_str_to_obj = function(sizesArray) {

			return { size: { width: sizesArray.width, height: sizesArray.height, isAspectRatio: false },
					 expectedCreativeCount: 1,
					 creativeSizeType: 'PIXEL', };
		};

		var creativePlaceholdersObject = sizesArray.map(size_str_to_obj);

		return creativePlaceholdersObject;
};

var convertCPMandCurrencyToDFPMoneyObject = function(cpm, currency) {
		return {
		    currencyCode: currency,
		    microAmount: (Math.round(cpm * 10000)).toFixed(0)
		};
};

var build_line_item = function(order_id, name, cpm, sizes, config, currency_code, Dfp) {

	var creativePlaceHoldersObject = convertSizeArraytoCreativePlaceholdersObject(sizes);

	return util._extend({
		orderId: order_id,
		name: name,
		startDateTime: Dfp.DfpDate.from(new Date(), 'America/New York'),
		startDateTimeType: 'IMMEDIATELY',
		unlimitedEndDateTime: true,
		lineItemType: 'PRICE_PRIORITY',
		costPerUnit: convertCPMandCurrencyToDFPMoneyObject(cpm, currency_code),
		costType: 'CPM',
		creativePlaceholders: creativePlaceHoldersObject,
		disableSameAdvertiserCompetitiveExclusion: true,
		primaryGoal: { goalType: 'NONE', unitType: 'IMPRESSIONS', units: '-1' },
		targeting: {},
	}, config);
};

module.exports = build_line_item;