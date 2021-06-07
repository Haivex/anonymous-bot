require('dotenv').config();
const { v4: uuidv4 } = require('uuid');

//Config for bot;
const CHANNEL_NAME_FOR_ANONYMOUS_MESSAGE = process.env.CHANNEL_NAME;
const BOT_TOKEN = process.env.BOT_TOKEN;
const SERVER_ID = process.env.SERVER_ID;

if (!CHANNEL_NAME_FOR_ANONYMOUS_MESSAGE || !BOT_TOKEN || !SERVER_ID) {
  throw new Error('Wrong config');
}

const Discord = require('discord.js');
const client = new Discord.Client();

let currentGuild;

let last20messages = [];

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  currentGuild = client.guilds.cache.find((guild) => guild.id === SERVER_ID);
});

client.on('message', (msg) => {
    msg.author.id
  if (msg.channel.type === 'dm' && !msg.author.bot) {
    const messageInfo = {
      messageId: uuidv4(),
      messageContent: msg.content,
      messageAuthor: msg.author,
    };

    if (last20messages.length >= 20) {
      last20messages.pop();
    }
    last20messages.unshift(messageInfo);

    const givenChannel = currentGuild.channels.cache.find(
      (channel) => channel.name === CHANNEL_NAME_FOR_ANONYMOUS_MESSAGE
    );

    givenChannel.send(`Wiadomość nr: ${messageInfo.messageId}\n${msg.content}`);
    msg.reply('Anonimowa wiadomosć została dodana');
  }

  if (
    msg.content.startsWith('/ban author') &&
    msg.member.hasPermission('BAN_MEMBERS') &&
    !msg.author.bot
  ) {
    const messageId = msg.content.split(' ')[2];
    const foundedAuthor = last20messages.find(
      (messageInfo) => messageInfo.messageId == messageId
    ).messageAuthor;
    msg.reply(`Zbanowany użytkownik: ${foundedAuthor}`);
    const member = msg.guild.members.cache.find((member) => member.id == foundedAuthor.id)
    member.ban('Nadużycie anonimowych wiadomości');
  }
});

client.login(BOT_TOKEN);
