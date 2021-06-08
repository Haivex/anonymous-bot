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
    commandMessage.reply(`nie znaleziono wiadomości o podanym numerze`);
    return;
  }

  const foundedAuthor = foundedMessage.author;

  if (!commandMessage.guild) {
    commandMessage.reply(`nie można banować użytkownika w prywatnej wiadomości`);
    return;
  }

  commandMessage.guild.members
    .fetch({ user: foundedAuthor })
    .then((member) => {
      member.ban({ reason: 'Nadużycie anonimowych wiadomości' });
      commandMessage.reply(`zbanował użytkownika: ${member}`);
      foundedAuthor.send(`${foundedAuthor}, zostałeś zbanowany za nadużycie anonimowych wiadomości`)
    })
    .catch(() => {
      commandMessage.reply(`nie znaleziono użytkownika`);
    });
};
