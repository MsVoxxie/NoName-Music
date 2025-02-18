const { ActivityType, PresenceUpdateStatus } = require('discord.js');

module.exports = {
	name: 'updatePresence',
	runType: 'infinity', //! Has rate limiting issues :(
	async execute(client) {
		// If the bot is in maintenance mode, do not update presence
		if (client.maintenanceMode) return;

		//! Disabled
		// Check if the last presence update was less than 3 minutes ago
		// const lastUpdated = client.lastPresenceUpdate || 0;
		// const currentTime = Date.now();
		// if (currentTime - lastUpdated < 3 * 60 * 1000) return;

		// Get all queues and calculate the total number of songs and their duration
		const allQueues = await client.distube.queues.collection;

		// If there are no queues, set the presence to "Idle"
		if (!allQueues.size) {
			return await client.user.setPresence({ activities: [{ name: 'Idle', type: ActivityType.Custom }], status: PresenceUpdateStatus.Idle });
		}

		// If there are queues, set the presence to "Listening"
		const totalSongs = allQueues.reduce((acc, queue) => acc + queue.songs.length, 0);
		const totalDuration = allQueues.reduce((acc, queue) => acc + queue.formattedDuration, 0).replace(/^0+/, '');

		// Update the bot's presence with the total songs and duration
		await client.user.setPresence({
			activities: [{ name: `${totalSongs} Song${totalSongs !== 1 ? 's' : ''} for ${totalDuration}`, type: ActivityType.Listening }],
			status: PresenceUpdateStatus.Online,
		});

		// Update the last presence update time
		client.lastPresenceUpdate = Date.now();
	},
};
