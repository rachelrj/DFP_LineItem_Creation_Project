'use strict';

//Only checks for api whitelist error
//Expand to other errors as these come up
var check_for_error_type = function(error) {

	if(error.body){
		var errorBody = error.body;
		if(errorBody.search("NOT_WHITELISTED_FOR_API_ACCESS") != -1) {
			return "NOT_WHITELISTED_FOR_API_ACCESS";
		}
		return error.body;
	}
	return error;

};

module.exports = check_for_error_type;