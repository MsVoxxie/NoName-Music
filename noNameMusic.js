// Configuration File
const dotenv = require('dotenv');
dotenv.config();

// Cron Job
const cron = require('node-cron');

// Discord Classes
const { DisTube } = require('distube');
const { SpotifyPlugin } = require('@distube/spotify');
const { SoundCloudPlugin } = require('@distube/soundcloud');
const { YtDlpPlugin } = require('@distube/yt-dlp');
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
	leaveOnStop: false,
	leaveOnEmpty: true,
	leaveOnFinish: true,
	emitNewSongOnly: true,
	emitAddSongWhenCreatingQueue: true,
	emitAddListWhenCreatingQueue: true,
	plugins: [
		new YtDlpPlugin({ update: true }),
		new SoundCloudPlugin(),
		new SpotifyPlugin({
			emitEventsAfterFetching: true,
		}),
	],
});

// Define Collections
client.commands = new Collection();
client.events = new Collection();

// Client Constants
client.color = '#f3d600';

// Run Loaders
client.mongoose = require('./core/loaders/mongooseLoader');
require('./core/loaders/commandLoader')(client);
require('./core/loaders/eventLoader')(client);
require('./core/loaders/musicLoader')(client);

// Create a cron every day at midnight
cron.schedule('0 0 * * *', async () => {
	client.emit('deleteMostPlayed');
});

client.login(process.env.DISCORD_TOKEN);
