var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function(callback){

});

var kittySchema = mongoose.Schema({
    name: String
});

kittySchema.methods.speak = function(){
    var greeting = this.name ? "Meow name is " + this.name : "I forgotmy name";
    console.log(greeting);
};

var Kitten = mongoose.model('Kitten', kittySchema);

var meow = new Kitten({name: 'Silence'});
var fluffy = new Kitten({name: 'Fluffy'});

fluffy.speak();
fluffy.save(function(err, fluffy){
    if (err) return console.error(err);
    fluffy.speak();
});

Kitten.find({name: /^Fluff/ },function(err, kittens){
    if (err) return console.log(err);
    console.log(kittens);
});