var route = require('./route')
var server = require('./server');
var requestHandlers = require('./requestHandlers');
var handle = {}
handle["/"]=requestHandlers.start;
handle["/collection"]=requestHandlers.collection;

server.start(route.route,handle);
