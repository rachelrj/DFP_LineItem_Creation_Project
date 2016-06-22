var generateURL = require('../services/generateAuthenticationUrl.js');
var createOrder = require('../services/createOrder.js');
var createAdvertiser = require('../services/createAdvertiser.js');
var createUser = require('../services/createUser.js');
var getSettings = require('../util/getSettings.js');
var createPlacement = require('../services/createPlacement.js');
var createLineItems = require('../services/createLineItems.js');
var createCreativeAssociations = require('../services/createCreativeAssociations.js');

var appRouter = function(app) {


	app.get("/authenticationURL", function(req, res) {

		if(!req.query){
			return res.send({"status": "error", "message": "missing parameters"});
		}
		if(!req.query.client_id){
			return res.send({"status": "error", "message": "missing client ID"});
		}
		if(!req.query.client_secret){
			return res.send({"status": "error", "message": "missing client secret"});
		}

		var client_id = req.query.client_id;
		var client_secret = req.query.client_secret;

		var message = generateURL(client_id, client_secret);
	    
	    return res.send(message);

	});

	app.all('/create*', function (req, res, next) {
		if(!req.body){
			return res.send({"status": "error", "message": "missing body"});
		}
		if(!req.body.network_code){
			return res.send({"status": "error", "message": "missing network code"});
		}
		if(!req.body.app_name){
			return res.send({"status": "error", "message": "missing app name"});
		}
		if(!req.body.client_id){
			return res.send({"status": "error", "message": "missing client id"});
		}
		if(!req.body.client_secret){
			return res.send({"status": "error", "message": "missing client secret"});
		}
		if(!req.body.refresh_token){
			return res.send({"status": "error", "message": "missing refresh token"});
		}
		next(); // pass control to the next handler
	});

	app.post("/createUser", function(req, res) {

		var settings = getSettings(req);

		var result = createUser(settings);
		result.then(function(result) {
			res.send(result);
		});

	});

	app.post("/createOrder", function(req, res) {

		if(!req.body.order_name){
			return res.send({"status": "error", "message": "missing order name"});
		}
		if(!req.body.advertiser_id){
			return res.send({"status": "error", "message": "missing advertiser"});
		}
		if(!req.body.user_id){
			return res.send({"status": "error", "message": "missing user"});
		}

		var settings = getSettings(req);

		var result = createOrder(settings, req.body.order_name, req.body.advertiser_id, req.body.user_id);
		result.then(function(result) {
        	res.send(result);
    	});

	});

	app.post("/createAdvertiser", function(req, res) {

		if(!req.body.advertiser_name){
			return res.send({"status": "error", "message": "missing advertiser name"});
		}

		var settings = getSettings(req);

		var result = createAdvertiser(settings, req.body.advertiser_name);
		result.then(function(result) {
        	res.send(result);
    	});

	});

	app.post("/createPlacement", function(req, res) {
		if(!req.body.placement_name){
			return res.send({"status": "error", "message": "missing placement name"});
		}

		var settings = getSettings(req);

		var result = createPlacement(settings, req.body.placement_name);
		result.then(function(result) {
        	res.send(result);
    	});

	});

	app.post("/createLineItems", function(req, res) {

		if(!req.body.start_cpm){
			return res.send({"status": "error", "message": "missing starting cpm"});
		}
		if(!req.body.end_cpm) {
			return res.send({"status": "error", "message": "missing ending cpm"});
		}
		if(!req.body.advertiser_name) {
			return res.send({"status": "error", "message": "missing advertiser name"});
		}
		if(!req.body.order_id) {
			return res.send({"status": "error", "message": "missing order ID"});
		}
		if(!req.body.sizes) {
			return res.send({"status": "error", "message": "missing sizes"});
		}
		if(!req.body.placement) {
			return res.send({"status": "error", "message": "missing placement"});
		}

		var settings = getSettings(req);

		var result = createLineItems(settings, req.body.start_cpm, req.body.end_cpm, req.body.advertiser_name, req.body.order_id, req.body.sizes, req.body.placement);
		result.then(function(result) {
			res.send(result);
		});

	});

	app.post("/createCreativeAssociations", function(req, res) {
		if(!req.body.creatives){
			return res.send({"status": "error", "message": "missing creatives"});
		}
		if(!req.body.sizes){
			return res.send({"status": "error", "message": "missing sizes"});
		}
		if(!req.body.line_items){
			return res.send({"status": "error", "message": "missing line items"});
		}
		var settings = getSettings(req);

		var i = 0;
		var chunk = 25;
		var n = req.body.line_items.length;
		var promisesArray = [];

		function generatePromises() {
			var newLineItemArray;
			if(n > (i+chunk)){
				newLineItemArray = req.body.line_items.slice(i,i+chunk);
			}
			else {
				newLineItemArray = req.body.line_items.slice(i,(n - 1));
			}
			var newPromise = createCreativeAssociations(settings, req.body.creatives, req.body.sizes, newLineItemArray);
			promisesArray.push(newPromise);

    		setTimeout(function() {
    			i += chunk;
    			if (i < n) {
        			generatePromises();
    			}
  				else {
					Promise.all(promisesArray)
					.then(function(result) {
						res.send(result);
					});      	
  				}
			}, 7500);
		};

		generatePromises();

	});

}
 
module.exports = appRouter;