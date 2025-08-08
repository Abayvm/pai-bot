import dotenv from 'dotenv';
dotenv.config();
import { abusiveWord, abuseResponse } from './abuse.js';
import scrapePage from './scrape.js';
import { getAIResponse, summarize } from './ai.js';
import { Client, GatewayIntentBits } from 'discord.js';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

client.on('ready', () => {
    const guild = client.guilds.cache.get(process.env.GUILD_ID);
    if (!guild) {
        console.error("Guild not found!");
        return;
    }

    const GeneralChannel = guild.channels.cache.get(process.env.GENERAL_CHANNEL_ID);
    if (!GeneralChannel) {
        console.error("Channel not found!");
        return;
    }

    GeneralChannel.send(`https://tenor.com/view/this-server-isn't-your's-conquer-server-gif-13199173468143276292`);
    console.log(`Logged in as ${client.user.username}!`);
});

client.on('guildMemberAdd', (member) => {
    const welcomeChannel = member.guild.channels.cache.get(process.env.WELCOME_CHANNEL_ID);
    if (welcomeChannel) {
        welcomeChannel.send(`Namaskaaram <@${member.id}>`);
    }
});

const afkMap = new Map();

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    if (afkMap.has(message.author.id)) {
        const afkSince = afkMap.get(message.author.id);
        const duration = Math.floor((Date.now() - afkSince) / 1000);
        message.reply(`${message.author} is no longer AFK. AFK for ${duration} seconds.`);
        afkMap.delete(message.author.id);
    }

    if (message.content === "/afk") {
        message.reply(`${message.author} is AFK`);
        afkMap.set(message.author.id, Date.now());
        return;
    }

    if (message.content === "!help") {
        message.reply(`${message.author} ask anything, I will try to answer. use !pai <query> for high IQ responses or !scrape <url> for scraping web content.`);
        return;
    }

    const words = message.content.split(" ");
    for (let word of words) {
        if (abusiveWord.includes(word)) {
            const reply = abuseResponse[Math.floor(Math.random() * abuseResponse.length)];
            message.reply(reply);
            return;
        }
    }

    if (message.content.startsWith('!pai')) {
    const query = message.content.slice(5).trim();
    if (!query) {
        return message.reply(`${message.author} entha vende?`);
    }
    try {
        const chunks = await getAIResponse(query);
        if (!chunks.length) {
            return message.reply('aranjooda');
        }
        for (const chunk of chunks) {
            if (chunk && chunk.trim() !== "") {
                await message.reply(chunk);
            }
        }
    } catch (err) {
        console.error(err);
        message.reply('error');
    }
    return;
}

if (message.content.startsWith('!scrape')) {
    const parts = message.content.split(' ');
    if (parts.length < 2) {
        return message.reply('angne alla, ingne: `!scrape https://example.com`');
    }

    const url = parts[1];
    message.channel.send(`scraping: ${url}`);

    try {
        const { text, media } = await scrapePage(url);
        const summaryChunks = await summarize(text); 
        for (const chunk of summaryChunks) {
            if (chunk && chunk.trim() !== "") {
                await message.channel.send(`**summary:**\n${chunk}`);
            }
        }

        if (media.length > 0) {
            message.channel.send(`**media found:**\n${media.join('\n')}`);
        }
    } catch (err) {
        console.error(err);
        message.channel.send('error');
    }
}

});

client.login(process.env.PAI_TOKEN);

