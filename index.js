
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates
    ]
});

// Wklej tutaj token bota
const TOKEN = 'PASTE_BOT_TOKEN_HERE';

// Wklej tutaj ID kanału AFK
const AFK_CHANNEL_ID = 'PASTE_AFK_CHANNEL_ID_HERE';

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
