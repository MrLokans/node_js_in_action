var fs = require('fs');

fs.readFile('./resource.json', function(err, data){
	// console.log(data);
});

var stream = fs.createReadStream('./resource.json');
stream.on('data', function(chunk){
    console.log(chunk);
    console.log('-');
});

stream.on('end', function(){
    console.log('finished');
});