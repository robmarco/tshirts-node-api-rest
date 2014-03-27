/**
 * Created by Roberto Marco
 */

// Including dependencies
var express = require('express'),
    app = express(),
    mongoose = require('mongoose');


// Configure for all environments
app.configure(function(){
    app.use(express.bodyParser());      // JSON Parser
    app.use(express.methodOverride());  // Override HTTP methods
    app.use(app.router);                // Define new routes
});

// Error handling - error hadnling middleware are defined just like regular middleware,
// however must be defined with an arity of 4, that is the signature (err, req, res, next)

function errorHandler(err, req, res, next) {
    res.status(500);
    res.render('error', { error: err });
}

routes = require('./routes/tshirts')(app);

// Connection to MongoDB
mongoose.connect('mongodb://localhost/tshirts', function(err, res){
    if (err)
        console.log('Error connecting to database. ' + err);
    else
        console.log('Connected to database.');
});

// Server prepare and listen
var server = app.listen(3000, function(){
    console.log('Node Server running on port %d', server.address().port);
});
