
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates
    ]
});

// Wklej tutaj token bota
const TOKEN = process.env.TOKEN;

// Wklej tutaj ID kanału AFK
const AFK_CHANNEL_ID = process.env.AFK_CHANNEL_ID;;

client.once('ready', () => {
    console.log(`Zalogowano jako ${client.user.tag}`);
});

client.on('voiceStateUpdate', async (oldState, newState) => {

    // Gdy użytkownik się wyciszy
    if (!oldState.selfMute && newState.selfMute) {

        // Jeśli siedzi na kanale głosowym
        if (newState.channel) {

            try {
                await newState.setChannel(AFK_CHANNEL_ID);
                console.log(`${newState.member.user.tag} został przeniesiony na AFK`);
            } catch (err) {
                console.error('Błąd przenoszenia:', err);
            }
        }
    }
});

client.login(TOKEN);
