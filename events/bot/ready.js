const { Events } = require('discord.js');
const Logger = require('../../functions/logging/logger');

module.exports = {
	name: Events.ClientReady,
	runType: 'single',
	async execute(client) {
		// Emit updatePresence event
		client.emit('updatePresence');

		// Initialize the database
		Logger.success(`Ready! Logged in as ${client.user.tag}`);
		await client.mongoose.init();
	},
};
