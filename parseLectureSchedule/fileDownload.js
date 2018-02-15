var https = require('https');
var fs = require('fs');

this.downloadFile = function(url, callback) {
	var urlSplit = url.split("/");
	var filename = urlSplit[urlSplit.length - 1];
	var file = fs.createWriteStream('tmp/new.' + filename);
	var request = https.get(url, function(response) {
		response.pipe(file);
		callback(filename);
	});
}