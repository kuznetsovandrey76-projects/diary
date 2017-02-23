var express = require('express');

var MongoClient = require('mongodb').MongoClient;
var db = require('./my_modules/db.js');
var bodyParser = require('body-parser');

// add it
var cookieParser = require('cookie-parser');
var expressValidator = require('express-validator');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var app = express();

var handlebars  = require('express-handlebars')
// main - это основной макет main.handlebars
	.create({defaultLayout:'main'});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

var mongoose = require('mongoose');
// mongoose.connect('mongodb://<dbuser>:<dbpassword>...');
mongoose.connect(db.url);

var home = require('./routes/home');
var login = require('./routes/login');

// Init App

var Post = mongoose.model('diary-programming', { 
	day: String,
	progress: String,
	thoughts: String,
	link: String
});

// Set Static Folder
app.use(express.static(__dirname + '/public'));	

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// POST
app.post('/save', function(req, res) {
	var newPost = new Post(req.body);

	newPost.save(function (err) {
		// необязательная функция	
	  if (err) { console.log(err); } 
	  else { console.log('данные загружены в базу'); }
	});
	res.end();
});

// GET
app.get('/blog', function(req, res) {
	// в local массив с объектами и db [{},{}]
	Post.find({}, { _id: 0, __v: 0 }).then(function(local) {
		res.render('blog', {items: local});
	});
});

// app.use - Middleware
app.use('/', home);
app.use('/enter', login);

// NOT FOUND
app.use(function(req, res, next) {
	res.status(404);
	res.render('404');
});

app.use(function(err, req, res, next) {
	res.status(500);
	res.render('500');
});

// NODE SERVER.JS
app.set('port', process.env.PORT || 8080);

app.listen(app.get('port'), function() {
	console.log('Express запущен на http://localhost:' + 
		app.get('port') + ': нажмите CTRL+C для завершения');
});
