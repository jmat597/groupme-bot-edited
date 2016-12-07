const async = require('async');
const request = require('request');
const _ = require('underscore');
const events = require('events');
const util = require('util');
const http = require('http');
const formidable = require('formidable');
console.log("Running jmat-bot-wrap 12.38");

// config { token:groupme token,
//          group:the room to connect to,
//          name: the bot name,
//          url: optional callback,
//          avatar_url: optional avatar image
function Bot (config) {
  if (! (this instanceof Bot)) return new Bot(config);
  for (var key in config) if ( config.hasOwnProperty(key) )  this[key] = config[key];
  if (this.token && this.group && this.name && this.bot_id) {
    console.log("Config exists k");
    this.botId = this.bot_id;
  } else {
    console.log("pass me config so you can actually be a bot");
  }
};

util.inherits(Bot, events.EventEmitter);

// start the web server
// arg: address to serve on
Bot.prototype.serve = function(address) {
  var self = this;
  var server = http.createServer(function (request, response) {
    if (request.url == '/' && request.method == 'GET') {
      response.writeHead(200, {"Content-Type": "application/json"});
      response.end(JSON.stringify({'name': self.name, 'group': self.group}));
    } else if (request.url == '/incoming' && request.method == 'POST') {
      var form = new formidable.IncomingForm();
      var messageFields = {};
      form.parse(request, function(err, fields, files) {
        if (err) console.error("bad incoming data " + err);
      });

      form.on('field', function(name, value) {
        messageFields[name] = value;
      });

      form.on('end', function() {
        response.writeHead(200, {"Content-Type": "text/plain"});
        response.end("THANKS");
        self.emit('botMessage', self, { name:messageFields.name, text:messageFields.text });
      });

    } else {
      response.writeHead(404, {"Content-Type": "text/plain"});
      response.end("NOT FOUND");
    }

  }.bind(this));

  server.listen(address);
};

// make the bot say something
Bot.prototype.message = function(_message) {
  var url = 'https://api.groupme.com/v3/bots/post';
  var package = {};
  package.text = _message;
  package.bot_id = this.botId;
  request( { url:url, method:'POST', body: JSON.stringify(package) });
};

// destroys a bot by id, if no bot_id is sent, unregisters itself
Bot.prototype.unRegister = function(bot_id, callback) {
  var url = 'https://api.groupme.com/v3/bots/destroy?token=' + this.token;
  request( { url : url, method : 'POST', body : JSON.stringify({bot_id:bot_id}) },
           function(error, response, body) {
             callback();
           });
};

module.exports = Bot;
