var fs = require('fs');
var route = function(handle, pathname, response, request) {
    console.log('route' + pathname);
    if (typeof handle[pathname] === 'function') {
        handle[pathname](response, request);
    } else {
        var filePath = __dirname + pathname
        fs.exists(filePath, function(err) {
            if (err) {
                var ext = path.extname(filePath);
                ext = ext ? ext.slice(1) : 'unknown';
                var contentType = MIME_TYPE[ext] || "text/plain";
                fs.readFile(filePath, function(err, data) {
                    if (err) {
                        response.end("<h1>500</h1>服务器内部错误！");
                    } else {

                        response.writeHead(200, { 'content-type': contentType });
                        response.write(data.toString())
                        response.end();

                    }
                    hasFile = true;
                });
            } else {
                console.log("No request handler found for " + pathname);
                response.writeHead(404, { "Content-Type": "text/plain" });
                response.write("404 Not found");
                // return "404 Not found";
                response.end();
            }
        })


    }
}
exports.route = route;
