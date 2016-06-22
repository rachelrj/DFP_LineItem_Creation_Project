'use strict';

var list_to_pql = (function(field, list) {
	var pql = "where " + field + " in (";
	pql += list.map(function(n) { return "'" + n + "'" }).join(', ');
	pql += ")";
	return pql;
});

module.exports = list_to_pql;