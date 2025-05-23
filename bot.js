import dotenv from 'dotenv';
dotenv.config();
import { abusiveWord, abuseResponse } from './abuse.js';

import { Client, GatewayIntentBits, messageLink } from 'discord.js';
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers]
});

client.on('ready', () => {
    console.log(`Logged in as ${client.user.username}!`);
});

client.on('guildMemberAdd', (member) => {
    const welcomeChannel = member.guild.channels.cache.get(process.env.WELCOME_CHANNEL_ID);
    if (welcomeChannel) {
        welcomeChannel.send(`Namaskaaram <@${member.id}>`);
    }
});

const afkMap = new Map();

client.on('messageCreate', (message) => {

    if(afkMap.has(message.author.id)){
        message.reply(`${message.author.toString()} is no more afk`);
        afkMap.delete(message.author.id);
    }

    if(message.content == "/afk"){
        message.reply(`${message.author.toString()} is afk`);
        console.log(message.author.id);
        afkMap.set(message.author.id);
    }
    
    let messageAnalysis = message.content.split(" ");
    for (let i = 0; i < messageAnalysis.length; i++) {
        for (let j = 0; j < abusiveWord.length; j++) {
            if (messageAnalysis[i] === abusiveWord[j]) {
                let chooseReply = Math.floor(Math.random() * abuseResponse.length);
                message.reply(abuseResponse[chooseReply]);
                return;
            }
        }
    }
});

client.login(process.env.PAI_TOKEN);
