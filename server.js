var restify      = require('restify');
var fs           = require('fs');
var serveStatic = require('serve-static-restify');
var jwt          = require('restify-jwt');

//const MainController = require('./controller/MainController');

const Models = require('./models');

var server = restify.createServer({
    name : 'TravelAgent',
})

server.pre(serveStatic('public/',{'index': ['index.html']}));

server.use(restify.plugins.bodyParser());

Models.sequelize.sync().then(() => {
    server.listen(8080, function (){
       console.log('Start server on port 8080') 
    });
});