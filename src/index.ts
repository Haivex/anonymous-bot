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

    if (givenChannel) {
      givenChannel.send(
        `Wiadomość nr: ${messageInfo.messageId}\n${msg.content}`
      );
      msg.reply('Anonimowa wiadomosć została dodana');
    } else {
      msg.reply('Nie znaleziono kanału. Sprawdź konfigurację bota!');
    }
  }

  if (
    msg.content.startsWith('/ban author') &&
    msg.member.hasPermission('BAN_MEMBERS') &&
    !msg.author.bot
  ) {
    const messageId = msg.content.split(' ')[2];
    const foundedMessageInfo = last20messages.find(
      (messageInfo) => messageInfo.messageId == messageId
    );

    let foundedAuthor;
    if (foundedMessageInfo) {
      foundedAuthor = foundedMessageInfo.messageAuthor;
    }

    if (foundedAuthor) {
      msg.reply(`Zbanowany użytkownik: ${foundedAuthor}`);
      msg.guild.members.fetch({user: foundedAuthor}).then((member) => {
        member.ban({ reason: 'Nadużycie anonimowych wiadomości' });
      }).catch(() => {
        msg.reply(`Nie znaleziono użytkownika`);
      })
    } else {
      msg.reply(`Nie znaleziono użytkownika lub wiadomości`);
    }
  }
});

client.login(BOT_TOKEN);
