'use strict';

var getService = (function (service, dfpUser) {

	var Promise = require("bluebird");

	return dfpUser.getServiceAsync(service)
		.then(function(s) { return Promise.promisifyAll(s); 
	});

});

module.exports = getService;