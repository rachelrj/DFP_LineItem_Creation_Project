'use strict';
var get_service = require('./getService.js');
var generic_get_create = require('./generic_get_create.js');

var get_create_custom_criteria = function(custom_criteria_dict, dfpUser, Dfp) {
	return get_service('CustomTargetingService', dfpUser)
	.then(function(service) {
		var crit_keys = Object.keys(custom_criteria_dict);
		var ret = {};

		return generic_get_create(function(pql) {
				var stmt = new Dfp.Statement(pql +" and status != 'INACTIVE'");
				return service.getCustomTargetingKeysByStatementAsync(stmt);
			}, function(keys_to_add) {
				return service.createCustomTargetingKeysAsync({ keys: keys_to_add });
			}, function(name) {
				return { name: name, type: 'FREEFORM' };
			}, crit_keys)
		.then(function(key_by_name) {

			var p = [];

			for (var key_name in key_by_name) {
				var key_id = key_by_name[key_name].id;

				p.push(generic_get_create(function(pql) {
						var stmt = new Dfp.Statement(pql + " and status != 'INACTIVE' and customTargetingKeyId = " + key_id);
						return service.getCustomTargetingValuesByStatementAsync(stmt);
					}, function(vals_to_add) {
						return service.createCustomTargetingValuesAsync({ values: vals_to_add });
					}, function(key_id, name) {
						return { customTargetingKeyId: Number(key_id), name: name };
					}.bind(this, key_id), custom_criteria_dict[key_name])
				.then(function(key_name, key_id, val_by_name) {
					var val_id_by_name = {};

					for (var val_name in val_by_name)
						val_id_by_name[val_name] = val_by_name[val_name].id;

					val_id_by_name['__ID__'] = key_id;

					ret[key_name] = val_id_by_name;
				}.bind(this, key_name, key_id)));
			}
			return Promise.all(p);
		})
		.then(function() { return ret; });

	});
};

module.exports = get_create_custom_criteria;