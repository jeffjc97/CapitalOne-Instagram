var express = require('express');
var sentiment = require('sentiment');
// var bodyParser = require('body-parser');


var router = express.Router();
var app = express();
// app.use(bodyParser.urlencoded({ extended: false }));

/* GET home page. */
router.get('/', function(req, res, next) {
	// res.send('hi');
  	res.render('index', { title: 'Express' });
});

module.exports = router;
