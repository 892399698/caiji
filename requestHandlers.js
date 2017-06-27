var queryString = require("querystring");
var url = require('url');
var fs = require("fs");
var caiji = require("./caiji");
// var config = require("./config");
// formidable = require("formidable");
console.log(caiji)

function start(response) {
    console.log("Request handler 'start' was called.");

    var body = '<html>' +
        '<head>' +
        '<meta http-equiv="Content-Type" content="text/html; ' +
        'charset=UTF-8" />' +
        '<link rel="stylesheet" href="https://cdn.bootcss.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">' +
        '</head>' +
        '<body class="container-fluid">' +
        '<h1>采集</h1>' +
        '<div id="process"></div>' +
        '<input class="btn btn-primary " id="collection" type="submit" value="开始采集" />' +
        '<script src="https://code.jquery.com/jquery-2.2.4.min.js"></script>' +
        '<script src="https://cdn.bootcss.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>' +
        `<script type="text/javascript">
        $("#collection").click(function(){
            $.get('collection').fail(function(res){
                alert('采集失败')
            })
        })
        </script>` +
        '</body>' +
        '</html>';
    response.writeHead(200, { "Content-Type": "text/html" });
    response.write(body);
    response.end();
}

function collection() {
    // var url = 'https://stackoverflow.com/questions/tagged/javascript?sort=featured&pageSize=15'
    caiji.caiji.start();
}

exports.start = start;
exports.collection = collection;
