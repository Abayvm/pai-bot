require('dotenv').config()

const { Client, GatewayIntentBits, messageLink } = require('discord.js');
const client = new Client({ 
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers] 
});

client.on('ready', () => {
    console.log(`Logged in as ${client.user.username}!`);
});

client.on('guildMemberAdd', (member) => {
    const welcomeChannel = member.guild.channels.cache.get('1293478226152259618');
    if (welcomeChannel) {
        welcomeChannel.send(`mone ${member.user.username}e, serverilekk swagatham ${member.user.tag}!`);
    }
});

const theri = ['myr', 'myre', 'peladi', 'polayadi', 'andi', 'poor', 'poori', 'pooran', 'kunna', 'kunne', 'punde', 'oomb', 'oombikko'];
const theriResponse = ['oombiya varthanam parayardh', 'manyanmaarude sereveraahn punde', 'theri parayalle poora', 'theri vilicha adich ninte adapp theripikkum poora'];
client.on('messageCreate', (message)=>{
    let messageAnalysis = message.content.split(" ");
    for(let i=0; i<messageAnalysis.length; i++){
        for(let j=0; j<theri.length; j++){
            if(messageAnalysis[i] === theri[j]){
                let chooseReply = Math.floor(Math.random() * theriResponse.length);
                message.reply(theriResponse[chooseReply]);
                return;
            }
        }
    }
})

client.login(process.env.CLIENT_TOKEN);