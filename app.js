
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');


var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


//connect to MongoDB via Mongoose
mongoose.connect('mongodb://localhost/seworganized');
// Mongoose 
var User = mongoose.model('User', { username: String, fname: String, lname: String, city: String, state: String, zipcode: String});

var Pattern = mongoose.model('Pattern', {username: String, company: String, desc: String, id: String, url: String, size: String, imageurl: String});


// Routes

app.get('/', function(req, res){
	res.render('index');
});

app.get('/main', function(req, res){
	res.render('main');
});

app.get('/dummyuser', function(req, res){
	// create dummy user
	var dummy = new User({
		username: 'unicorn',
		fname: 'jane',
		lname: 'smith',
		city: 'boulder',
		state: 'co',
		zipcode: '80302'
	});
	dummy.save(function(){
		//just to stop the request 
		//(put it inside here to not send response until the save is done)
		res.send(true);
	// app.get('/', routes.index);
	// app.get('/users', user.list);
	});
});

app.get('/profile/:username', function(req, res){
	var username = req.params.username;
	var activeuser = User.findOne({username: username}, function (err, user) {
		if (user){
			res.render('profile', {user: user});
		}
		else {
			res.send('The username you entered does not exist.');
		}
	});
});

app.get('/getpatterns', function(req, res){
	Pattern.find({}, function(err, patterns){
		res.send(patterns);
	});
})

app.get('/patterns', function(req, res){
	//get patterns from database
	Pattern.find({}, function(err, patterns){
		res.render('patterns', {patterns: patterns});
	});
});

app.post('/addpattern', function(req, res){
	var pattern = req.body;
	
	if (pattern.patternId == 'undefined') {
		console.log('hells yeah!');
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
		console.log('booyah!');
		Pattern.findOneAndUpdate({_id: pattern.patternId}, {$set: {company: pattern.company, desc: pattern.desc, id: pattern.id, url: pattern.url, size: pattern.size, imageurl: pattern.imageurl}}, {}, function(err,data){
			if(err) {
				res.send(500, 'Error encountered attempting to save changes to database.');
			}
			else {
				res.send(data);
			}
		});
	}
});

app.post('/activepattern', function(req, res) {
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

app.post('/editpattern', function(req, res) {
	//for n number of arguments it loops through each to change the corresponding key value pair in db
	var id = req.body.objectId;
	//will need the id to modify just the one element
	var activePattern = Pattern.update({_id: id}, function (err, data){
		if(err) {
			res.send('There was an error with your request.')
		}
		else {
			res.send('Changes were saved successfully.');
		}
	});
});

app.post('/deletepattern', function(req, res) {
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

app.get('/fabrics', function(req, res){
	res.render('fabrics');
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});