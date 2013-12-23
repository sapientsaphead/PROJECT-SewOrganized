// Module dependencies

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');
var config = require('./oauth.js')
var passport = require('passport')
var FacebookStrategy = require('passport-facebook').Strategy;

var app = express();

app.configure(function() {
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.logger());
// Initialize Passport
// IMPORTANT: must add before app.use(app.router)
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.session({ secret: 'badwolf' }));
app.use(passport.initialize());
app.use(passport.session());

app.use(app.router);
app.use(express.static(__dirname + '/public'));
});

// port
app.listen(3000);

//connect to MongoDB via Mongoose
var mongoUrl = global.process.env.MONGOHQ_URL || 'mongodb://localhost/seworganized';
mongoose.connect(mongoUrl);

// Mongoose User Model
var User = mongoose.model('User', { 
	facebookID: Number,
	username: String,
	email: String,
	firstname: String,
	lastname: String,
	gender: String,
	location: String, 
	created: String,
});

if (!User.schema.options.toObject) User.schema.options.toObject = {}

User.schema.options.toObject.transform = function (doc, ret, options) {
	ret._id = ret._id.toString();
}

// config
passport.use(new FacebookStrategy({
		clientID: config.facebook.clientID,
		clientSecret: config.facebook.clientSecret,
		callbackURL: config.facebook.callbackURL
  	},
	function(accessToken, refreshToken, profile, done) {
		console.log('profile', profile);
 		User.findOne({ facebookID: profile.id }, function(err,user){
 			if(err){return done(err); }
 			// if the user exists
 			if(user){
 				done(null, user);
 			}
 			// otherwise create a new user
 			else {
 				console.log('profile', profile);
 				var user = new User({
 					facebookID: profile.id,
 					username: profile.username,
 					email: profile._json.email,
 					firstname: profile.name.givenName,
 					lastname: profile.name.familyName,
 					gender: profile.gender,
 					location: profile.current_location,
 					created: new Date()
 				});
 				// img src ="https://graph.facebook.com/"+ username +"/picture?width=200&height=200"
 				user.save(function(err){
 					if(err) throw err;
 					console.log('New user: ' + User.name + ' created and logged in.');
 					done(null, user);
 				});
 			}
 		})
	}
));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// serialize and deserialize
passport.serializeUser(function(user, done) {
	done(null, user.id);
});

// passport.deserializeUser(function(obj, done) {
// done(null, obj);
// });
passport.deserializeUser(function(id, done) {
	User.findById(id, function (err, user) {
		done(err, user);
	});
});

// Configuration routes
// Redirect the user to Facebook for authentication.  When complete,
// Facebook will redirect the user back to the application at
//     /auth/facebook/callback
app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }), function(req, res){

});
// Facebook will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/', scope: ['email'] }), function(req, res) {
	res.redirect('/account');
});

// test authentication
var isAuthenticated = function(req, res, next) {
	if (req.isAuthenticated()) { next(); }
	else {res.redirect('/');}
}

// Mongoose Models: Patterns, Fabrics, etc.
var Pattern = mongoose.model('Pattern', {
	oauthID: Number, 
	company: String, 
	desc: String, 
	id: String, 
	url: String, 
	size: String, 
	imageurl: String
});

var Fabric = mongoose.model('Fabric', {
	// username: String,
	oauthID: Number,
	company: String,
	fcollection: String,
	desc: String,
	width: String,
	fcontent: String,
	fwash: String,
	imageurl: String
});

// Routes

app.get('/', function(req, res){
	res.render('index');
});

// app.get('/', function(req, res){
// 	console.log({user: req.user});
// 	res.render('login', { user: req.user });
// });

app.get('/user', function(req, res){
	console.log({user: req.user});
	res.send({ user: req.user });
});

app.get('/logout', function(req, res){
	req.logout();
	res.redirect('/');
});

app.get('/account', isAuthenticated, function(req, res){
	res.render('account', { user: req.user });
});

app.get('/profile', isAuthenticated, function(req, res){
	if (req.user){
		res.render('profile', {user: req.user});
	}
	else {
		res.send('The username you entered does not exist.');
	}
});

app.post('/activeuser', isAuthenticated, function(req, res) {
	//get user from database
	var id = req.body.objectId;
	console.log('the active id', id)
	var activeUser = User.findById(id, function (err, user){
		if(err) {
			res.send('There was an error with your request.')
		}
		else {
			res.send(user);
		}
	});
});

app.post('/edituser', isAuthenticated, function(req, res) {
	var user = req.body;
	var id = user.userid;
	console.log('the id to edit', id);

	User.findByIdAndUpdate(id, {fname: user.fname, lname: user.lname, city: user.city, state: user.state, zipcode: user.zipcode}, {}, function (err, user){
		if(err) {
			res.send(500, 'Error encountered attempting to save changes to database.');
		}
		else {
			res.send(user);
		}
	});
});

app.get('/getpatterns', isAuthenticated, function(req, res){
	Pattern.find({}, function(err, patterns){
		res.send(patterns);
	});
})

app.get('/patterns', isAuthenticated, function(req, res){
	//get patterns from database
	Pattern.find({}, function(err, patterns){
		res.render('patterns', {patterns: patterns});
	});
});

app.post('/addpattern', isAuthenticated, function(req, res){
	var pattern = req.body;
	
	if (pattern.patternId === undefined) {
		var patternInfo = new Pattern({
			username: 'unicorn',
			company: pattern.company,
			desc: pattern.desc,
			id: pattern.id,
			url: pattern.url,
			size: pattern.size,
			imageurl: pattern.imageurl
		});
		patternInfo.save(function(err, data){
			if(err) {
				res.send(500, 'Error encountered attempting to save new pattern to database.');
			}
			else {
				res.send(data);
			}
		});	
	}
	else {
		Pattern.findOneAndUpdate({_id: pattern.patternId}, {$set: {company: pattern.company, desc: pattern.desc, id: pattern.id, url: pattern.url, size: pattern.size, imageurl: pattern.imageurl}}, {}, function (err,data){
			if(err) {
				res.send(500, 'Error encountered attempting to save changes to database.');
			}
			else {
				res.send(data);
			}
		});
	}
});

app.post('/activepattern', isAuthenticated, function(req, res) {
	//get pattern from database
	var id = req.body.objectId;
	var activePattern = Pattern.findOne({_id: id}, function (err, pattern){
		if(err) {
			res.send('There was an error with your request.')
		}
		else {
			res.send(pattern);
		}
	});
});

app.post('/deletepattern', isAuthenticated, function(req, res) {
	var id = req.body.objectId;
	var deletePattern = Pattern.remove({_id: id}, function (err, data){
		if(err) {
			res.send('Unable to delete pattern at this time.')
		}
		else {
			res.send(id);
		}
	});
});

app.get('/fabrics', isAuthenticated, function(req, res){
	res.render('fabrics');
});

app.get('/getfabrics', isAuthenticated, function(req, res){
	Fabric.find({}, function(err, fabrics){
		res.send(fabrics);
	});
})

app.post('/addfabric', isAuthenticated, function(req, res){
	var fabric = req.body;
	console.log('fabric', fabric);
	console.log('fabric id', fabric.fabricId);
	if (fabric.fabricId === undefined) {
		var fabricInfo = new Fabric({
			username: 'unicorn',
			company: fabric.company,
			fcollection: fabric.fcollection,
			desc: fabric.desc,
			width: fabric.width,
			fcontent: fabric.fcontent,
			fwash: fabric.fwash,
			imageurl: fabric.imageurl
			
		});
		console.log('fabric info', fabricInfo);
		fabricInfo.save(function (err, data){
			if(err) {
				res.send(500, 'Error encountered attempting to save new pattern to database.');
			}
			else {

				res.send(data);
			}
		});	
	}
	else {
		Fabric.findOneAndUpdate({_id: fabric.fabricId}, {$set: {company: fabric.company, fcollection: fabric.fcollection, desc: fabric.desc, width: fabric.width, fcontent: fabric.fcontent, fwash: fabric.fwash , imageurl: fabric.imageurl}}, {}, function (err,data){
			if(err) {
				res.send(500, 'Error encountered attempting to save changes to database.');
			}
			else {
				res.send(data);
			}
		});
	}
});

app.post('/activefabric', isAuthenticated, function(req, res) {
	//get fabric from database
	var id = req.body.objectId;
	var activeFabric = Fabric.findOne({_id: id}, function (err, fabric){
		if(err) {
			res.send('There was an error with your request.')
		}
		else {
			res.send(fabric);
		}
	});
});

app.post('/deletefabric', isAuthenticated, function(req, res) {
	var id = req.body.objectId;
	var deleteFabric = Fabric.remove({_id: id}, function (err, data){
		if(err) {
			res.send('Unable to delete pattern at this time.')
		}
		else {
			res.send(id);
		}
	});
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});