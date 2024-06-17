const mostPlayed = require('../../models/mostPlayed');
const Logger = require('../../functions/logging/logger');

module.exports = {
	name: 'deleteMostPlayed',
	runType: 'infinity',
	async execute(client) {
		// Set an expiration time
		const expirationTime = 60 * 1000 * 60 * 24 * 30; // 30 days in milliseconds
		const currentTime = Date.now();

		// Try to remove all documents that are older than the expiration time
		try {
			await mostPlayed.updateMany({}, { $pull: { songs: { lastListened: { $lt: currentTime - expirationTime } } } });
		} catch (error) {
			Logger.error(`An error occurred while trying to delete old documents from the mostPlayed collection.\n${error}`);
		}
	},
};
