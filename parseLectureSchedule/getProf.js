var fs = require('fs');
this.getProf = function(title, course) {
	if (!course) {
		console.log(title);
		return null;
	}
	try {var profs = require('../lecturers/profs_' + course + '.json'); return profs[title.trim()]; }
	catch(ex) {return null};
}