const { Events, ActivityType, PresenceUpdateStatus } = require('discord.js');
const Logger = require('../../functions/logging/logger');

module.exports = {
	name: Events.ClientReady,
	runType: 'single',
	async execute(client) {
		// Initialize the database
		Logger.success(`Ready! Logged in as ${client.user.tag}`);
		await client.mongoose.init();

		if (client.maintenanceMode) {
			await client.user.setPresence({
				activities: [{ name: `Currently undergoing maintenance. Thanks, Youtube.`, type: ActivityType.Playing }],
				status: PresenceUpdateStatus.Online,
			});
		} else {
			await client.emit('updatePresence');
		}
	},
};
