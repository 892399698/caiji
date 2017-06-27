var http = require('http');
var https = require('https');
var urls = require('url');
var config = require("./config");

var caiji = {
    start: function() {
    	var urls = config.urls;
    	urls.forEach(function(url){
    		// var 
    	})
        var urls = this.getListUrl();
    },
    getListUrl: function() {

        var protocol = urls.parse(url).protocol;
        var h = http;
        if (protocol === 'https:') {
            h = https;
        }
        h.get(url, function(req, res) {
            var html = '';
            req.on('data', function(data) {
                html += data;
            })
            req.on('end', function() {
                // console.log(html)
            })
        })
    }
}
exports.caiji = caiji;
