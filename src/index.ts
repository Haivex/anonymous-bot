require('dotenv').config();
import { v4 as uuidv4 } from 'uuid';
import Discord, { ClientUser, Guild, TextChannel } from 'discord.js';
import { AnonymousMessage } from './anonymous-message.interface';

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
    const anonymousMessage = {
      id: uuidv4(),
      content: msg.content,
      author: msg.author,
    };

    if (lastMessages.length >= 20) {
      lastMessages.pop();
    }
    lastMessages.unshift(anonymousMessage);

    const givenChannel = currentGuild.channels.cache.find(
      (channel) => channel.name === CHANNEL_NAME_FOR_ANONYMOUS_MESSAGE
    ) as TextChannel

    if (givenChannel) {
      givenChannel.send(
        `Wiadomość nr: ${anonymousMessage.id}\n${msg.content}`
      );
      msg.reply('Anonimowa wiadomosć została dodana');
    } else {
      msg.reply('Nie znaleziono kanału. Sprawdź konfigurację bota!');
    }
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
