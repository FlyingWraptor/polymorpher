const Discord = require('discord.js');

const config = require('./config.json');

const client = new Discord.Client({
    retryLimit: 10
});
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setPresence({ activity: { name: "the morphin' game", type: 'PLAYING'}, status: 'online' });
});

client.on('voiceStateUpdate', (oldState, newState) => {
    // Check if user is morphed
    if (newState.member.roles.cache.find(x => x.id === config.polymorph.roleId)) {
        if (newState.channel) {
            if (newState.channelID !== config.polymorph.voiceId) {
                newState.setChannel(config.polymorph.voiceId);
                stopIt(newState.member);
            }
        }
    }
});

client.on('message', (message) => {
    // Check if user is morphed
    if (message.member.roles.cache.find(x => x.id === config.polymorph.roleId)) {
        if (message.channel.id !== config.polymorph.voiceId) {
            message.delete();
            stopIt(message.member);
        }
    }
});

client.on('guildMemberUpdate', (oldMember, newMember) => {
    if (newMember.roles.cache.find(x => x.id === config.polymorph.roleId)) {
        if (newMember.voice.channelID !== config.polymorph.voiceId) {
            newMember.setChannel(config.polymorph.voiceId);
            stopIt(newMember);
        }
    }
});

function stopIt(member) {
    const channel = client.channels.fetch(config.polymorph.channelId);
    channel.then(x => x.send(`You're polymorphed <@${member.id}>, cunt!`));
}

client.login(config.token);