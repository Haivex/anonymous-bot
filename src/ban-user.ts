import { Message } from 'discord.js';
import { AnonymousMessage } from './anonymous-message.interface';

export const banMessageAuthor = (
  anonymousMessageId: string,
  commandMessage: Message,
  messagesInMemory: AnonymousMessage[]
): void => {
  const foundedMessage = messagesInMemory.find(
    (messageInfo) => messageInfo.id == anonymousMessageId
  );

  if (!foundedMessage) {
    commandMessage.reply(`Nie znaleziono wiadomości`);
    return;
  }

  const foundedAuthor = foundedMessage.author;

  if (!commandMessage.guild) {
    commandMessage.reply(`Nie można banować użytkownika w prywatnej wiadomości`);
    return;
  }

  commandMessage.guild.members
    .fetch({ user: foundedAuthor })
    .then((member) => {
      member.ban({ reason: 'Nadużycie anonimowych wiadomości' });
      commandMessage.reply(`Zbanowany użytkownik: ${member}`);
    })
    .catch(() => {
      commandMessage.reply(`Nie znaleziono użytkownika`);
    });
};
