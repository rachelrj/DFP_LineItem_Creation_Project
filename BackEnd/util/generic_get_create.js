'use strict';
var list_to_pql = require('./listToPQL.js');
var getResponseResults = function (resp) {
		return (resp && resp.rval && resp.rval.results) || [];		
};
var generic_get_create = function(getter, creator, builder, name_list) {

	var pql = list_to_pql('name', name_list);

	return getter(pql)
	.then(function(resp) {
		var objs = getResponseResults(resp);
		var obj_by_name = {};

		for (var i = 0; i < objs.length; i++)
			obj_by_name[objs[i].name] = objs[i];

		var objs_to_add = [];
		for (var i = 0; i < name_list.length; i++)
			if (!obj_by_name[name_list[i]])
				objs_to_add.push(builder(name_list[i]));

		if (objs_to_add.length == 0)
			return obj_by_name;

		return creator(objs_to_add)
		.then(function(resp) {
			var objs = (resp && resp.rval) || [];
			for (var i = 0; i < objs.length; i++)
				obj_by_name[objs[i].name] = objs[i];

			return obj_by_name;
		});
	});
};

module.exports = generic_get_create;