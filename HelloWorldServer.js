var http = require('http');
var fs = require('fs');

http.createServer(function(req, res){
	res.writeHead(200, {'Content-Type': 'image/png'});
    // In this one-liner, the data is read in from the file ( fs.createReadStream ) and is sent
    // out ( .pipe ) to the client ( res ) as it comes in.
	fs.createReadStream('./bullets.jpg').pipe(res);
}).listen(3000);
console.log("Server running at http://localhost:3000");