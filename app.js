var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();



app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use('/',require('./routes/index'));
app.use('/api/svg',require('./routes/api/svg'));
app.get('/home',function (req,res) {
    res.render('home')
})

module.exports = app