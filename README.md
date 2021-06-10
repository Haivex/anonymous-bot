# Purpose of the project
Purpose of the project was to learn Discord API, Discord.js library and to understand operation of bots, sockets.

# Features
- User can write Direct Message to Bot and then bot send this message to given channel
- Administrator can warn/kick/ban the author of the given message giving message id to command
- Show command result on the given channel, e.g: '@John, you have banned @Haivex for breaking rules'
- Send command result in a private message to message's author , e.g: '@Haivex, you have been banned for breaking rules'

# Commands
- /ban author [messageId] -- ban the author of the given message
- /kick author [messageId] -- kick the author of the given message
- /warn author [messageId] -- warn the author of the given message

# Bot Config
Put following variables to .env file
- SERVER_ID - your Discord Guild ID
- CHANNEL_NAME - channel name to which messages are to be sent
- BOT_TOKEN - your token for Bot
