var http = require('http');
var https = require('https');
var urls = require('url');
var config = require("./config");
var async = require('async');
var caiji = {
    parseOverflowPagesize: function(html) {
        if (!html) {
            console.log('解析页数的html不能为空!')
        }
        var reg = /<span class="page-numbers">(\d+)<\/span>/gi;
        var matches = html.match(reg),
            pageSize = 1;
        if (matches) {
            var match = matches.pop();
            if (match) {
                var execs = reg.exec(matches);
                pageSize = execs.pop() || 1;
            }
        }
        return pageSize;
    },
    parseOverflowArticleUrls: function(html) {
        var reg = /<a[^<]+class="question-hyperlink"[^<]+(?=<\/a>[\r\n]?<\/h3>)/gi,
            reg2 = /href="([^"]+)"/;
        var matches = html.match(reg),
            urls = [];
        matches && matches.forEach(function(m) {
            var execs = reg2.exec(m);
            if (execs[1]) {
                if (config.config.host) {
                    urls.push(config.config.host + execs[1])
                } else {
                    urls.push(execs[1])
                }
            }
        })
        return urls;
    },
    parseOverflowList: function(html) {
        var pageSize = this.parseOverflowPagesize(html);
        var urls = this.parseOverflowArticleUrls(html);
        var result = {
            pageSize: pageSize,
            urls: urls
        }
        console.log(result)
        return result

    },
    getRequest: function(url, callback) {
        // var self = this;
        var h = this.getProtocol(url);
        h.get(url, function(req, res) {
            var html = '';
            req.on('data', function(data) {
                html += data;
            })
            req.on('end', function() {
                // self.parseList(html);
                callback(html);
                // console.log(html)
            })
        })
    },
    getProtocol: function(url) {
        var protocol = urls.parse(url).protocol;
        var h = http;
        if (protocol === 'https:') {
            h = https;
        }
        return h;
    },
    getArticle: function(url) {
        var h = this.getProtocol(url);
        h.get(url, function(req, res) {
            var html = '';
            req.on('data', function(data) {
                html += data;
            })
            req.on('end', function() {
                // console.log(html)
            })
        })
    },
    start: function() {
        var urls = config.config.urls,
            self = this;
        async.eachSeries(urls, function(url, callback) {
            self.getListUrl(url);
        })
    },
    getArticleContent: function(html) {
        var titleReg = /[^>]+(?=<\/a>[\r\n]?<\/h1>)/,
            contentReg = /<div class="post-text" itemprop="text">[\w\W]+?(?=<\/div>)/
        var title = html.match(titleReg);
        var content = html.match(contentReg);
        var result = {
            title: title,
            content: content
        }
        return result
    },
    translateAndSave: function(html) {
        if (!html) {
            return;
        }
        var content = this.getArticleContent(html);
    },
    getListArticles: function(obj, url, page) {
        // var urls  = obj.urls,
        var pageSize = obj.pageSize,
            currentPage = page || 1,
            listUrl,
            self = this;
        if (/\?/g.test(url)) {
            listUrl = url + '&page=' + page
        } else {
            listUrl = url + '?page=' + page
        }
        // if (!urls || !urls.lengh) {
        //     console.log('采集链接不能为空!');
        //     return '';
        // }
        this.getRequest(listUrl, function(html) {
            var urls = self.parseOverflowArticleUrls(html);
            if (urls && urls.length)
                async.mapLimit(urls, 30, function(url) {
                    self.getRequest(url, function(html) {
                        // console.log(html)
                        self.translateAndSave(html);
                    })
                }, function() {
                    ++currentPage;
                    console.log('page:' + currentPage)
                    if (currentPage < pageSize) {
                        self.getListArticles(obj, url, currentPage);
                    }
                })
        })




    },
    getListUrl: function(url) {
        var self = this;
        this.getRequest(url, function(html) {
            var urlArrs = {};
            var target = config.config.target;
            switch (target) {
                case 'overflowestack':
                    urlArrs = self.parseOverflowList(html);
                    break;
                default:
                    urlArrs = self.parseOverflowList(html);
                    break;
            }

            self.getListArticles(urlArrs, url);
        })

    }
}
exports.caiji = caiji;
