
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
var mongoUrl = global.process.env.MONGOHQ_URL || 'mongodb://localhost/seworganized';
mongoose.connect(mongoURL);

// Mongoose 
var User = mongoose.model('User', { 
	username: String, 
	fname: String, 
	lname: String, 
	city: String, 
	state: String, 
	zipcode: String
});

if (!User.schema.options.toObject) User.schema.options.toObject = {}

User.schema.options.toObject.transform = function (doc, ret, options) {
	ret._id = ret._id.toString();
}

var Pattern = mongoose.model('Pattern', {
	username: String, 
	company: String, 
	desc: String, 
	id: String, 
	url: String, 
	size: String, 
	imageurl: String
});

var Fabric = mongoose.model('Fabric', {
	username: String,
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
	var activeuser = User.findOne({username: username}, {__v: 0}, function (err, user) {
		if (user){
			res.render('profile', {user: user});
		}
		else {
			res.send('The username you entered does not exist.');
		}
	});
});

app.post('/activeuser', function(req, res) {
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

app.post('/edituser', function(req, res) {
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

// app.post('/editpattern', function(req, res) {
// 	var id = req.body.objectId;
// 	var activePattern = Pattern.update({_id: id}, function (err, data){
// 		if(err) {
// 			res.send('There was an error with your request.')
// 		}
// 		else {
// 			res.send('Changes were saved successfully.');
// 		}
// 	});
// });

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

app.get('/getfabrics', function(req, res){
	Fabric.find({}, function(err, fabrics){
		res.send(fabrics);
	});
})

app.post('/addfabric', function(req, res){
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

app.post('/activefabric', function(req, res) {
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

app.post('/deletefabric', function(req, res) {
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

app.get('/classes', function(req, res){
	res.render('classes');
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});