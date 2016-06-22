var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var cors = require('express-cors');
var timeout = require('connect-timeout');
 
app.use(cors({
	allowedOrigins: [
		'http://localhost:*', '*.lijit.com:*'
	]
}));

app.use(timeout(500000));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
 
var routes = require("./routes/routes.js")(app);
 
var server = app.listen(3000, function () {
    console.log("Listening on port %s...", server.address().port);
});