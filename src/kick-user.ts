import { Message } from 'discord.js';
import { AnonymousMessage } from './anonymous-message.interface';

export const kickMessageAuthor = (
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
    commandMessage.reply(`nie można wyrzucać użytkownika w prywatnej wiadomości`);
    return;
  }

  commandMessage.guild.members
    .fetch({ user: foundedAuthor })
    .then((member) => {
      member.kick('Nadużycie anonimowych wiadomości');
      commandMessage.reply(`wyrzucił użytkownika: <@${member}>`);
      foundedAuthor.send(`<@${foundedAuthor}>, zostałeś wyrzucony z serwera za nadużycie anonimowych wiadomości`)
    })
    .catch(() => {
      commandMessage.reply(`nie znaleziono użytkownika`);
    });
};
