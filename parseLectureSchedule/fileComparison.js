var fs = require('fs');
var crypto = require('crypto');

function checksum (str, algorithm, encoding) {
    return crypto
        .createHash(algorithm || 'sha1')
        .update(str, 'utf8')
        .digest(encoding || 'hex')
}

this.compareFiles = function(filename, callback) {
	if (fs.existsSync("tmp/" + filename) && fs.existsSync("tmp/" + (filename + ".csv"))) {
		fs.readFile("tmp/" + filename, function (errOld, dataOld) {
		    var oldFile = checksum(dataOld, 'sha256');
			fs.readFile("tmp/" + filename, function (errNew, dataNew) {
				var newFile = checksum(dataNew, 'sha256');
				callback(newFile == oldFile);
			});
		});
		return;
	}
	callback(false);
}