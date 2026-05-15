const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates
    ]
});

const TOKEN = process.env.TOKEN;
const AFK_CHANNEL_ID = process.env.AFK_CHANNEL_ID;

// zapisywanie poprzednich kanałów
const previousChannels = new Map();

client.once('ready', () => {
    console.log(`Zalogowano jako ${client.user.tag}`);
});

client.on('voiceStateUpdate', async (oldState, newState) => {

    // użytkownik się wyciszył
    if (!oldState.selfMute && newState.selfMute) {

        // sprawdzenie czy siedzi na kanale
        if (newState.channel && newState.channel.id !== AFK_CHANNEL_ID) {

            try {

                // zapisanie poprzedniego kanału
                previousChannels.set(newState.id, newState.channel.id);

                // przeniesienie na AFK
                await newState.setChannel(AFK_CHANNEL_ID);

                console.log(`${newState.member.user.tag} został przeniesiony na AFK`);

            } catch (err) {
                console.error('Błąd przenoszenia na AFK:', err);
            }
        }
    }

    // użytkownik się odciszył
    if (oldState.selfMute && !newState.selfMute) {

        try {

            const previousChannelId = previousChannels.get(newState.id);

            // sprawdzenie czy poprzedni kanał istnieje
            if (previousChannelId) {

                const previousChannel = newState.guild.channels.cache.get(previousChannelId);

                if (previousChannel) {

                    // przeniesienie z powrotem
                    await newState.setChannel(previousChannel);

                    console.log(`${newState.member.user.tag} wrócił na poprzedni kanał`);

                    // usunięcie zapisu
                    previousChannels.delete(newState.id);
                }
            }

        } catch (err) {
            console.error('Błąd powrotu na kanał:', err);
        }
    }
});

client.login(TOKEN);
