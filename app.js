var http = require('http');
var fs = require('fs');
var qs = require('querystring');
var url = require('url');
var schedule = require('node-schedule');

// Chargement du fichier index.html affiché au client
var server = http.createServer(function(req, res) {
    var pathname = url.parse(req.url).pathname;
    if (pathname == "/waterbubble.min.js") {
        script = fs.readFileSync("waterbubble.min.js", "utf8");
        res.writeHead(200);
        res.end(script);
    } else if (pathname == "/coin.wav") {
        file = fs.readFileSync("coin.wav");
        res.writeHead(200);
        res.end(file);
    } else if (pathname == "/update") {
        var url_parts = url.parse(req.url,true);
        io.sockets.emit('message', {'euro': url_parts.query.euro, 'percent': url_parts.query.percent});
        res.writeHead(200);
        res.end();
    } else {
        fs.readFile('./index.html', 'utf-8', function(error, content) {
            res.writeHead(200, {"Content-Type": "text/html"});
            res.end(content);
        });
    }
}).listen(8088);

// Chargement de socket.io
var io = require('socket.io').listen(server);

var rule = new schedule.RecurrenceRule();
rule.hour = 0;
rule.minute = 0;

var j = schedule.scheduleJob(rule, function(){
  io.sockets.emit('message', {'euro': 0, 'percent': 0});
});

