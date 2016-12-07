var bot = require('fancy-groupme-bot');
var util = require('util');


// local configuration read from env.
const TOKEN = process.env['TOKEN']; // your groupme api token
const GROUP = process.env['GROUP']; // the room you want to join
const NAME = process.env['NAME']; // the name of your bot
const URL = process.env['URL']; // the domain you're serving from, should be accessible by Groupme.
const CONFIG = {token:TOKEN, group:GROUP, name:NAME, url:URL};
const PORT = process.env.PORT || 8000;

var mybot = bot(CONFIG);

mybot.on('botRegistered', function(b) {
  console.log("I am registered");
  b.message("WHAT UP BRO?");
});

mybot.on('botMessage', function(b, message) {
  console.log("I got a message, fyi");
  if (message.name != b.name && message.name != "GroupMe") {
    b.message(message.name + " said " + message.text);
	console.log(b);
	console.log(mybot);
  }
});

var now = new Date();
var millisTill10 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 60, 0, 0) - now;
if (millisTill10 < 0) {
     millisTill10 += 86400000; // it's after 10am, try 10am tomorrow.
}
setTimeout(function(){console.log("Timeout")}, millisTill10);

console.log("i am serving")
console.log(now);
console.log(millisTill10);
mybot.serve(PORT);