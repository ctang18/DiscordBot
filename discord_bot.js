var Discord = require("discord.js");
var request = require("request");
var fs = require("fs");

var AuthDetails = require("./auth.json");

var types = {
	"video": 0,
	"vid": 0,
	"vine": 1
}

/* Chat Commands */
var commands = {
	"nostalgia": {
		usage: "[type]",
		description: "Returns a random link. Can optionally pass a specific type of link",
		process: function(bot,msg,suffix) {	
			if(!isChannelNoSpam(msg.channel.id.toString())){
				var nosType = 0;
				if(!suffix){
					nosType = Math.floor(Math.random() * 2);
				} else {
					nosType = types[suffix];
				}
				
				switch(nosType) {
					case 0:
						var index = Math.floor(Math.random() * nostalgiaJSON.videos.length)
						bot.sendMessage(msg.channel,"" + nostalgiaJSON.videos[index].url + "\nPosted by: " + nostalgiaJSON.videos[index].author);
						break;
					case 1:
						var index = Math.floor(Math.random() * nostalgiaJSON.vines.length)
						bot.sendMessage(msg.channel, nostalgiaJSON.vines[index].url + "\nPosted by: " + nostalgiaJSON.vines[index].author);
						break;
					default:
						
				}
			}
		}
	},
	"roll": {
		usage: "[high number]",
		description: "Returns a number between 1 and the highest number inclusive. 6 by default",
		process: function(bot,msg,suffix) {
			if(!suffix){
				bot.sendMessage(msg.channel, Math.floor((Math.random() * Number(6)) + 1));
			} else if(Number(suffix) <= 1) {
				bot.sendMessage(msg.channel, "Fuck off");
			} else {
				bot.sendMessage(msg.channel, Math.floor((Math.random() * Number(suffix)) + 1));
			}
		}
	},
	"choose": {
		usage: "<option1> <option2> ...",
		description: "Returns a choice given a list of options",
		process: function(bot,msg,suffix) {
			var options = suffix.split(" ");
			if(!suffix){
				bot.sendMessage(msg.channel, "Stop");
			} else {
				bot.sendMessage(msg.channel, options[Math.floor((Math.random() * (Number(options.length))))]);
			}
		}
	},
	"challenge": {
		description: "Returns a challenge",
		process: function(bot,msg,suffix) {
			if(!suffix){
			} else {
				bot.sendMessage(msg.channel,"@everyone " + msg.author + " has challenged " + suffix + " to " + 
					challenges.challenges[Math.floor(Math.random() * challenges.challenges.length)].challenge);
			}
		}
	},
	"addchallenge": {
		usage: "<challenge to add>",
		description: "Add a challenge to the list of challenges",
		process: function(bot,msg,suffix) {
			if(!suffix){
				bot.sendMessage(msg.channel,"!addchallenge " + this.usage + "\n" + this.description);
			} else {
				challenges['challenges'].push({"challenge":suffix});
				fs.writeFile("./challenges.json",JSON.stringify(challenges, null, 2), null);
				bot.sendMessage(msg.channel,"added challenge: " + suffix);
			}
		}
	},
	"punishment": {
		description: "Returns a punishment",
		process: function(bot,msg,suffix) {
			bot.sendMessage(msg.channel,"The punishment is: " + punishments.punishments[Math.floor(Math.random() * punishments.punishments.length)].punishment);
		}
	},
	"addpunishment": {
		usage: "<punishment to add>",
		description: "Add a punishment to the list of punishments",
		process: function(bot,msg,suffix) {
			if(!suffix){
				bot.sendMessage(msg.channel,"!addpunishment " + this.usage + "\n" + this.description);
			} else {
				punishments['punishments'].push({"punishment":suffix});
				fs.writeFile("./punishments.json",JSON.stringify(punishments, null, 2), null);
				bot.sendMessage(msg.channel,"added punishment: " + suffix);
			}
		}
	},
	"novakoi": {
		description: "Returns price of StatTrak Nova | Koi (Factory New)",
		process: function(bot,msg,suffix) {
			var url = 'http://steamcommunity.com/market/priceoverview/?appid=730&currency=1&market_hash_name=StatTrak%E2%84%A2%20Nova%20%7C%20Koi%20%28Factory%20New%29';
			
			request({
				url: url,
				json: true
			}, function (error, response, body) {
				if (!error && response.statusCode === 200) {
					bot.sendMessage(msg.channel,"StatTrak Nova | Koi (Factory New)\nLowest Price: " + body.lowest_price
						+ "\nMedian Price: " + body.median_price + "\nVolume: " + body.volume);
				} else {
					bot.sendMessage(msg.channel,"Unable to retrieve price at this time");
				}
			});
		}
	},
	"nospam": {
		description: "Set current channel to no spam mode for bot",
		process: function(bot,msg,suffix) {
			permissions['nospam'].push({"channel":msg.channel.id});
			fs.writeFile("./permissions.json",JSON.stringify(permissions, null, 2), null);
			bot.sendMessage(msg.channel,"Setting " + msg.channel + " to nospam");
			console.log(msg.channel.id);
		}
	},
	"isnospam": {
		description: "Returns if channel is set to no spam mode",
		process: function(bot,msg,suffix) {
			bot.sendMessage(msg.channel,"" + (isChannelNoSpam(msg.channel.id.toString()) ? "True" : "False"));
		}
	},
	"alias": {
		usage: "<name> <command>",
		description: "Aliases a link to a name",
		process: function(bot,msg,suffix) {
			var args = suffix.split(" ");
			var name = args.shift();
			var command = args.shift();
			
			if(aliases[name]){
				bot.sendMessage(msg.channel,"Alias '" + name + "' already exists.");
			} else {
				bot.sendMessage(msg.channel,"Adding new alias: " + name);
				
				aliases[name] = { "command": command };
				fs.writeFile("./aliases.json",JSON.stringify(aliases, null, 2), null);
			}
		}
	}
};

/* Load Data Files */
try{
	var nostalgiaJSON = require("./data/nostalgia.json");
} catch(e) {
    console.log("Couldn't load nostalgia.json. error: " + e);
}

try{
	var challenges = require("./data/challenges.json");
} catch(e) {
    console.log("Couldn't load challenges.json. error: " + e);
}

try{
	var punishments = require("./data/punishments.json");
} catch(e) {
    console.log("Couldn't load punishments.json. error: " + e);
}

try{
    var permissions = require("./data/permissions.json");
} catch(e) {
	console.log("Couldn't load permissions.json. error: " + e);
}

try{
    var aliases = require("./data/aliases.json");
} catch(e) {
	console.log("Couldn't load aliases.json. error: " + e);
}

var bot = new Discord.Client();

bot.on("ready", function () {
	console.log("Ready to begin! Serving in " + bot.channels.length + " channels");
});

bot.on("disconnected", function () {
	console.log("Disconnected!");
	process.exit(1);
});

bot.on("message", function (msg) {
	//Check if message is a command or alias
	if(msg.author.id != bot.user.id && (msg.content[0] === '!' || msg.content.indexOf(bot.user.mention()) == 0)){
        console.log("Received " + msg.content + " from " + msg.author + " as command");
		var cmdTxt = msg.content.split(" ")[0].substring(1);
        var suffix = msg.content.substring(cmdTxt.length+2);//add one for the ! and one for the space
        if(msg.content.indexOf(bot.user.mention()) == 0){
			try {
				cmdTxt = msg.content.split(" ")[1];
				suffix = msg.content.substring(bot.user.mention().length+cmdTxt.length+2);
			} catch(e){ //no command
				bot.sendMessage(msg.channel,"Yes?");
				return;
			}
        }
		var cmd = commands[cmdTxt];
        if(cmdTxt === "help"){
            //help is special since it iterates over the other commands
            for(var cmd in commands) {
                var info = "!" + cmd;
                var usage = commands[cmd].usage;
                if(usage){
                    info += " " + usage;
                }
                var description = commands[cmd].description;
                if(description){
                    info += "\n\t" + description;
                }
                bot.sendMessage(msg.channel,info);
            }
        }
		else if(cmd) {
            cmd.process(bot,msg,suffix);
		} else {
			bot.sendMessage(msg.channel, "Invalid command " + cmdTxt);
		}
	} else if(msg.author.id != bot.user.id && (msg.content[0] === '?' || msg.content.indexOf(bot.user.mention()) == 0)){
		var cmdTxt = msg.content.split(" ")[0].substring(1);
		var cmd = aliases[cmdTxt];
		if(cmd) {
			bot.sendMessage(msg.channel, ""+ cmd.command);
		} else {
			bot.sendMessage(msg.channel, "Invalid alias " + cmdTxt);
		}
	} else {
		//Ignore own messages
        if(msg.author == bot.user){
            return;
        }
		//Respond to mentions
        if (msg.author != bot.user && msg.isMentioned(bot.user)) {
			bot.sendMessage(msg.channel,msg.author + ", you called?");
        }
    }
});

/* Helper Functions */
function isChannelNoSpam(channel){	
	for(i = 0; i < permissions.nospam.length; i++){
		if(permissions.nospam[i].channel == channel)
			return true;
	}
	return false;
}

bot.login(AuthDetails.email, AuthDetails.password);
