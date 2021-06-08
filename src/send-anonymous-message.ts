import { Guild, Message, TextChannel } from 'discord.js';
import { AnonymousMessage } from './anonymous-message.interface';
import { v4 as uuidv4 } from 'uuid';

const MESSAGES_LIMIT = 20;

export const sendAnonymousMessage = (
  msg: Message,
  messagesInMemory: AnonymousMessage[],
  targetGuild: Guild,
  targetChannelName: string
): void => {
  const anonymousMessage = {
    id: uuidv4(),
    content: msg.content,
    author: msg.author,
  };

  if (messagesInMemory.length >= MESSAGES_LIMIT) {
    messagesInMemory.pop();
  }
  messagesInMemory.unshift(anonymousMessage);

  const givenChannel = targetGuild.channels.cache.find(
    (channel) => channel.name === targetChannelName
  ) as TextChannel;

  if (givenChannel) {
    givenChannel.send(`Wiadomość nr: ${anonymousMessage.id}\n${msg.content}`);
    msg.reply('Anonimowa wiadomosć została dodana');
  } else {
    throw new Error('Text Channel not found. Check bot config!');
  }
};
