'use strict';

var path = require('path'),
	http = require('http'),
	fs = require('fs'),
	app = http.createServer(function(req, res) {

		var url = req.url === '/' ? '/index.html' : req.url,
			filename = path.join(process.cwd(), 'build' + url);

		fs.readFile(filename, { encoding: 'utf8' }, function (err, html) {
			res.writeHead(200);
			res.end(html);
		});
	});

app.listen(3000, function () {
	console.log('node listening on http://localhost:3000/');
});
// change something while `nodemon app.js` is running
// and it will automatically reload the app for you.