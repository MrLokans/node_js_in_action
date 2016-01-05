var express = require('express');
var router = express.Router();

var User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function(req, res, next) {
  res.render('register', {
    title: 'Register'
  });
});

router.post('/register', function(req, res, next) {
    var name = req.body.name;
    var email = req.body.email; 
    var username = req.body.username; 
    var password = req.body.password; 
    var password2 = req.body.password2;

    console.log(req.file);
    console.log(req.files);


    if (req.file && req.file.profileimage){
        profImage = req.file.profileimage;
        console.log('Uploading file...');

        var profileImageOrigName = profImage.originalname;
        var profileImageSaveName = profImage.name;
        var profileImageSaveMime = profImage.mimetype;
        var profileImageSavePath = profImage.path;
        var profileImageSaveExt = profImage.extension;
        var profileImageSaveSize = profImage.size;    
    } else {
        // Default Image
        var profileImageSaveName = 'noimage.png';
    }

    // Validate form
    req.checkBody('name', 'Name field is required.').notEmpty();
    req.checkBody('email', 'Email field is required.').notEmpty();
    req.checkBody('email', 'Wrong email format.').isEmail();
    req.checkBody('username', 'Username field is required.').notEmpty();
    req.checkBody('password', 'Password field is required.').notEmpty();
    req.checkBody('password2', 'Passwords should match.').equals(password);

    // Check error statuses
    var errors = req.validationErrors();

    if (errors){
        res.render('register', {
            errors: errors,
            name: name,
            email: email,
            username: username,
            password: password,
            password2: password2,
        });
    } else {
        var newUser = new User({
            errors: errors,
            name: name,
            email: email,
            username: username,
            password: password,
            profileImage: profileImageSaveName 
        });

        console.log("Calling user creation");
        User.createUser(newUser, function(err, user){
            if (err) {
                throw err;
            }
            console.log("User creation succeedeed.");
            console.log(user);

        });

        req.flash('success', 'You are now registered.');
        res.location('/');
        res.redirect('/');
    }
});

router.get('/login', function(req, res, next) {
  res.render('login', {
    title: 'Log In'
  });
});


module.exports = router;
