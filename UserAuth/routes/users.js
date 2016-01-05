var express = require('express');
var router = express.Router();

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

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

passport.serializeUser(function(user, done){
    done(null, user.id);
});

passport.deserializeUser(function(id, done){
    User.getById(id, function(err, user){
        done(err, user);
    });
});


passport.use(new LocalStrategy(
    function(username, password, done){
        User.getByUsername(username, function(err, user){
            if (err) throw err;

            if(!user){
                console.log("No given user exists");
                return done(null, false, {message: 'Unknown username'});
            }

            User.comparePassword(password, user.password, function(err, isCorrect){
                if (err) throw err;

                if (isCorrect){
                    return done(null, user);
                } else {
                    console.log("Wrong password");
                    return done(null, false, {message: 'Wrong password'});
                }
            });
        });
    }
));

router.post('/login', 
            passport.authenticate('local', {failureRedirect: '/users/login', failureFlash: 'Invalid user credentials'}),
            function(req, res){
                console.log('Authentication succeeded.');
                req.flash('success', 'You are now logged in,');
                res.redirect('/');
});

router.get('/logout', function(req, res){
    req.logout();
    req.flash('success', 'Sucessfully logged out');
    res.redirect('/users/login');
});

module.exports = router;