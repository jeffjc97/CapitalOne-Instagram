var express = require('express');
var sentiment = require('sentiment');
// var bodyParser = require('body-parser');


var router = express.Router();
var app = express();
// app.use(bodyParser.urlencoded({ extended: false }));

app.get('/sentiment', function(request, response) {
	// console.log("POST called");

	// var text = request.body;
	// console.log("text = " + text);
 //    var res = {
 //        val: '5',
 //    };
 //    console.log(JSON.stringify(res));
 //    response.json(res);
 //    console.log("POST response sent.");
	response.send("FUCK");
});

/* GET home page. */
router.get('/', function(req, res, next) {
	// res.send('hi');
  	res.render('index', { title: 'Express' });
});

module.exports = router;
