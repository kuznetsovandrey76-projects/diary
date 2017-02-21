var express = require('express');
var app = express();

const MongoClient = require('mongodb').MongoClient;
var db = require('./my_modules/db.js');
const bodyParser = require('body-parser');

var handlebars  = require('express-handlebars')
// main - это основной макет main.handlebars
	.create({defaultLayout:'main'});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

var mongoose = require('mongoose');
// mongoose.connect('mongodb://<dbuser>:<dbpassword>...');
mongoose.connect(db.url);

var marked = require('marked');

var Post = mongoose.model('diary-programming', { 
	day: String,
	progress: String,
	thoughts: String,
	link: String
});

app.set('port', process.env.PORT || 8080);
app.use(express.static(__dirname + '/public'));	
app.use(bodyParser.json());

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
app.get(['/', '/index.html'], function(req, res) {
	res.render('index');
});

app.get('/blog', function(req, res) {
	// в local массив с объектами и db [{},{}]
	Post.find({}, { _id: 0, __v: 0 }).then(function(local) {
		res.render('blog', {items: local});
	});
});

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
app.listen(app.get('port'), function() {
	console.log('Express запущен на http://localhost:' + 
		app.get('port') + ': нажмите CTRL+C для завершения');
});
