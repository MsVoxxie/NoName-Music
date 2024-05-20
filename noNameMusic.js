// Configuration File
const dotenv = require('dotenv');
dotenv.config();

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
	emitAddListWhenCreatingQueue: false,
	plugins: [
		new YtDlpPlugin(),
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
require('./core/loaders/commandLoader')(client);
require('./core/loaders/eventLoader')(client);
require('./core/loaders/musicLoader')(client);

client.login(process.env.DISCORD_TOKEN);
