# DiscordBot
A chat bot for discord app based off <a href="https://github.com/hydrabolt/discord.js/">discord.js</a> forked from <a href="https://github.com/chalda/DiscordBot">chalda's bot</a> with more personal features

# Features:
- !nostalgia - Returns a random link from nostalgia.json (generated from a year old skype group chat)
- !choose - Have the bot make a decision given a list of options
- !roll - Return a random number
- !challenge - Issue a challenge to someone in a random game
- !punishment - Issues a punishment
- !alias - Create shorthand alias for a link
- !nospam - Sets a channel to nospam preventing spammy commands from being used

Use !help to get more detailed usage information

# Installation

This bot is written to run on top of node.js. Please see https://nodejs.org/en/download/

Once you have node installed running `npm install` from the bot directory should install all the needed packages. If this command prints errors the bot won't work!

## Windows Users
Please note that you must have a working C compiler and Python in your path for
`npm install` to work. The bot has been tested to work on Windows using Visual Studio 2015 Community and Python 2.7, except for `!pullanddeploy`.
* [Installing Node on Windows](http://blog.teamtreehouse.com/install-node-js-npm-windows)
* [npm errors on Windows](http://stackoverflow.com/questions/21365714/nodejs-error-installing-with-npm)
* [Visual Studio Community 2015](https://www.visualstudio.com/en-us/products/visual-studio-community-vs.aspx)
* [Python 2.7](https://www.python.org/downloads/)

# Running
Before first run you will need to create an `auth.json` file. The email and password for a discord account are required. The other credentials are not required for the bot to run, but highly recommended as commands that depend on them will malfunction. See `auth.json.example`.

To start the bot just run
`node discord_bot.js`.

# Updates
If you update the bot, please run `npm update` before starting it again. If you have
issues with this, you can try deleting your node_modules folder and then running
`npm install` again. Please see [Installation](#Installation).

# Todo:
* Create a script for setting up data and auth files
* Commands for editing data files (challenges, punishments, permissions)
* Establish data editing permissions
* Channel Management
* Remove a channel's nospam flag