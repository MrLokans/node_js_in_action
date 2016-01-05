var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

mongoose.connect('mongodb://localhost/nodeauth');
var db = mongoose.connection;

// User Schema

var UserSchema = mongoose.Schema({
    username: {
        type: String,
        index: true
    },
    password: {
        type: String,
        required: true,
        bcrypt: true,
    },
    email: {
        type: String
    },
    name: {
        type: String
    },
    profileimage: {
        type: String
    }
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.comparePassword = function(givenPassword, hash, cb){
    bcrypt.compare(givenPassword, hash, function(err, isCorrect){
        if (err) return cb(err);
        cb(null, isCorrect);
    });
};

module.exports.getByUsername = function(username, cb){
    var query = {username: username};
    User.findOne(query, cb);
};

module.exports.getById = function(userId, cb){
    User.findById(userId, cb);
};



module.exports.createUser = function(newUser, cb){
    // TODO: 10 is a bad salt
    console.log("Entering createUser");
    bcrypt.hash(newUser.password, 10, function(err, hashedPassword){
        if(err) throw err;

        // Set hashed password
        console.log("Setting password to " + hashedPassword);
        newUser.password = hashedPassword;
        console.log("Actually calling .save() method for the user model.");
        newUser.save(cb);
    });

};