// Configuration File
const dotenv = require('dotenv');
dotenv.config();

// Cron Job
const cron = require('node-cron');

// Discord Classes
const { DisTube } = require('distube');
const { YtDlpPlugin } = require('./vendor/@distube/yt-dlp');
const { SpotifyPlugin } = require('@distube/spotify');
const { SoundCloudPlugin } = require('@distube/soundcloud');
const { DirectLinkPlugin } = require('@distube/direct-link');
const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');
require('events').EventEmitter.defaultMaxListeners = 16;

// Define Client
const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMembers],
	partials: [Partials.Message, Partials.Channel],
	allowedMentions: { parse: [] },
});

// Music Client
client.distube = new DisTube(client, {
	plugins: [
		new SpotifyPlugin(),
		new SoundCloudPlugin(),
		new DirectLinkPlugin(),
		new YtDlpPlugin({
			// Use local wrapper script so we fully control flags
			binaryPath: './yt-dlp-wrapper.sh',
			update: false,
			processTimeout: 15000,
			// Let the plugin supply its own core args; we only
			// force safe behavior via the wrapper itself.
			args: [],
		}),
	],
	emitAddSongWhenCreatingQueue: true,
	emitAddListWhenCreatingQueue: true,
	nsfw: true,
});

// Debug logging for DisTube events
client.distube.on('debug', (message) => {
	console.log(`[DisTube Debug] ${message}`);
});

// Define Collections
client.commands = new Collection();
client.events = new Collection();

// Client Constants
client.color = '#f3d600';
client.maintenanceMode = false;
client.lastPresenceUpdate = 0;

// Run Loaders
client.mongoose = require('./core/loaders/mongooseLoader');
require('./core/loaders/commandLoader')(client);
require('./core/loaders/eventLoader')(client);
require('./core/loaders/musicLoader')(client);

// Create a cron every day at midnight
cron.schedule('0 0 * * *', async () => {
	client.emit('deleteMostPlayed');
});

// Update the presence every 5 minutes
cron.schedule('*/5 * * * *', async () => {
	client.emit('updatePresence');
});

client.login(process.env.DISCORD_TOKEN);
