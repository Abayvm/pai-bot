import dotenv from 'dotenv';
dotenv.config();
import { theri, theriResponse } from "./abuse.js";

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
        welcomeChannel.send(`mone ${member.user.username}e, serverilekk swagatham ${member.user.tag}!`);
    }
});

client.on('messageCreate', (message) => {
    let messageAnalysis = message.content.split(" ");
    for (let i = 0; i < messageAnalysis.length; i++) {
        for (let j = 0; j < theri.length; j++) {
            if (messageAnalysis[i] === theri[j]) {
                let chooseReply = Math.floor(Math.random() * theriResponse.length);
                message.reply(theriResponse[chooseReply]);
                return;
            }
        }
    }
});

client.login(process.env.PAI_TOKEN);
