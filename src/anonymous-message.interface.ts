import { User } from 'discord.js';

export interface AnonymousMessage {
    id: string;
    content: string;
    author: User
}
