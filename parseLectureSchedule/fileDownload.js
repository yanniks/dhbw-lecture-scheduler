var http = require('http');
var fs = require('fs');

this.downloadFile = function(url, callback) {
	var urlSplit = url.split("/");
	var filename = urlSplit[urlSplit.length - 1];
	var file = fs.createWriteStream(filename);
	var request = http.get(url, function(response) {
		response.pipe(file);
		callback(filename);
	});
}