import { Message, TextChannel } from 'discord.js';
import { AnonymousMessage } from './anonymous-message.interface';
import { v4 as uuidv4 } from 'uuid';

export const sendAnonymousMessage = (msg: Message, messagesInMemory: AnonymousMessage[], targetGuild): void => {
        const anonymousMessage = {
          id: uuidv4(),
          content: msg.content,
          author: msg.author,
        };
    
        if (messagesInMemory.length >= 20) {
            messagesInMemory.pop();
        }
        messagesInMemory.unshift(anonymousMessage);
    
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
