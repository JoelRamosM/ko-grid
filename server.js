var express = require("express");
var app = express();

app.use(express.static("./"));

var server = app.listen(2112,function  (argument) {
	var host = server.address().address;
	var port = server.address().port;
	console.log("App listening ar http://%s:%s",host,port);
})