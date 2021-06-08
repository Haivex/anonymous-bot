require('dotenv').config();
import Discord, { ClientUser, Guild, TextChannel } from 'discord.js';
import { AnonymousMessage } from './anonymous-message.interface';
import { sendAnonymousMessage } from './send-anonymous-message';

//Config for bot;
const CHANNEL_NAME_FOR_ANONYMOUS_MESSAGE = process.env.CHANNEL_NAME;
const BOT_TOKEN = process.env.BOT_TOKEN;
const SERVER_ID = process.env.SERVER_ID;

if (!CHANNEL_NAME_FOR_ANONYMOUS_MESSAGE || !BOT_TOKEN || !SERVER_ID) {
  throw new Error('Wrong config');
}

const client = new Discord.Client();

let currentGuild: Guild;
let lastMessages: AnonymousMessage[] = [];

client.on('ready', () => {
  const botName = client.user as ClientUser;
  console.log(`Logged in as ${botName.tag}!`);

  client.guilds.fetch(SERVER_ID, true).then(foundendGuild => {
    currentGuild = foundendGuild;
  }).catch(() => {
    throw new Error('Server not found');
  })
});

client.on('message', (msg) => {

  if (msg.channel.type === 'dm' && !msg.author.bot) {
    sendAnonymousMessage(msg, lastMessages, currentGuild)
  }

  if (
    msg.content.startsWith('/ban author') && msg.member && msg.guild &&
    msg.member.hasPermission('BAN_MEMBERS') &&
    !msg.author.bot
  ) {
    const messageId = msg.content.split(' ')[2];
    const foundedMessageInfo = lastMessages.find(
      (messageInfo) => messageInfo.id == messageId
    );

    let foundedAuthor;
    if (foundedMessageInfo) {
      foundedAuthor = foundedMessageInfo.author;
    }

    if (foundedAuthor) {
      msg.guild.members.fetch({user: foundedAuthor}).then((member) => {
        member.ban({ reason: 'Nadużycie anonimowych wiadomości' });
        msg.reply(`Zbanowany użytkownik: ${member}`);
      }).catch(() => {
        msg.reply(`Nie znaleziono użytkownika`);
      })
    } else {
      msg.reply(`Nie znaleziono użytkownika lub wiadomości`);
    }
  }
});

client.login(BOT_TOKEN);
