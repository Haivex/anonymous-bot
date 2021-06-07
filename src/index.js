require('dotenv').config()

//Config for bot;
const CHANNEL_NAME_FOR_ANONYMOUS_MESSAGE = process.env.CHANNEL_NAME;
const BOT_TOKEN = process.env.BOT_TOKEN;
const SERVER_ID = process.env.SERVER_ID

if(!CHANNEL_NAME_FOR_ANONYMOUS_MESSAGE || !BOT_TOKEN || !SERVER_ID) {
    throw new Error('Wrong config');
}

const Discord = require('discord.js');
const client = new Discord.Client();

let currentGuild;

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.channel.type === 'dm' && !msg.author.bot) {
    currentGuild = client.guilds.cache.find((guild) => guild.id === SERVER_ID);
    const givenChannel = currentGuild.channels.cache.find((channel) => channel.name === CHANNEL_NAME_FOR_ANONYMOUS_MESSAGE);
    givenChannel.send(msg.content);
    msg.reply('Twoja anonimowa wiadomosć została dodana');
  }
});

client.login(BOT_TOKEN);
