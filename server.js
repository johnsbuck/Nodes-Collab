// A very basic web server in node.js
// Stolen from: Node.js for Front-End Developers by Garann Means (p. 9-10)

var port = 8000;
var serverUrl = '127.0.0.1';

var http = require('http');
var path = require('path');
var fs = require('fs');

console.log('Starting web server at ' + serverUrl + ':' + port);

http.createServer( function(req, res) {

	var now = new Date();

	if(req.url == '/') {
		var filename = 'cover.html'
	} else {
		var filename = req.url || 'cover.html';
	}
	var ext = path.extname(filename);
	var localPath = __dirname + '/public';
	var validExtensions = {
		'.html' : 'text/html',
		'.js': 'application/javascript',
		'.css': 'text/css',
		'.txt': 'text/plain',
		'.jpg': 'image/jpeg',
		'.gif': 'image/gif',
		'.png': 'image/png',
		'.woff2': 'font/woff2'
	};
	var isValidExt = validExtensions[ext];

	if (isValidExt) {

		if(filename.indexOf('.html') != -1) {
			filename = '/HTML/' + filename;
		}

		localPath += filename;
		fs.access(localPath, fs.F_OK, function(err) {
			if(!err) {
				console.log('Serving file: ' + localPath);
				getFile(localPath, res, ext);
			} else {
				console.log('File not found: ' + localPath);
				res.writeHead(404);
				res.end();
			}
		});

	} else {
		console.log('Invalid file extension detected: ' + ext)
	}

}).listen(port, serverUrl);

function getFile(localPath, res, mimeType) {
	fs.readFile(localPath, function(err, contents) {
		if(!err) {
			res.setHeader('Content-Length', contents.length);
			res.setHeader('Content-Type', mimeType);
			res.statusCode = 200;
			res.end(contents);
		} else {
			res.writeHead(500);
			res.end();
		}
	});
}

function createDatabase()
{

}
