//Module Requires
var createError = require('http-errors');
var express = require('express');
var expressLayouts = require('express-ejs-layouts');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var dbServer = require('./bin/connector.js');
var bodyParser = require('body-parser');
var flash = require('express-flash');
var bcrypt = require('bcryptjs');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
var favicon = require('serve-favicon');

//Google analytics stuff
var expressGoogleAnalytics = require('express-google-analytics');
var analytics = expressGoogleAnalytics('G-DVG23CSX0K');

//Page router Requires
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var poemsRouter = require('./routes/poems');
var apiRouter = require('./routes/api');
// var infoRouter = require('./routes/info');


var app = express();
var PORT = process.env.PORT || 5000;

// Add the favicon
app.use(favicon(__dirname + '/public/favicon.ico'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('layout', 'layouts/default-layout.ejs')



// app.get('/',function(req,res){

//   if(req.session.page_views){
//     req.session.page_views++;
//   } else {
//     req.session.page_views = 1;
//   } 
//  // YOUR CODE HERE TO GET COMPORT AND COMMAND
// });

// app.use(function(req, res, next) {
//   res.local.page_views = req.session.page_views;
//   next();
// });


app.use(expressLayouts);
app.use(logger('dev'));
app.use(express.json());
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.use(session({
//   // store: new FileStore(),
//   secret: 'keyboard cat',
//   resave: true,
//   saveUninitialized: true,
// }));

app.use(session({
  cookieName: 'sessionName',
  proxy: true,
  resave: true,
  saveUninitialized: true,
  httpOnly: true,  // dont let browser javascript access cookie ever
  // secure: true, // only use cookie over https
  secret: "PEEPEEPOOPOO",
  ephemeral: true // delete this cookie while browser close
}));

app.use(bodyParser.urlencoded({limit: '10mb', extended: false}));
app.use(flash());

app.use(analytics);

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/poems', poemsRouter);
app.use('/api', apiRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

app.listen(PORT, () => console.log("Listening on port: " + PORT));


// error handler
/*()
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});*/

module.exports = app;
