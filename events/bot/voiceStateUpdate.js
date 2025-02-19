const { Events } = require('discord.js');
const { isVoiceChannelEmpty } = require('distube');

module.exports = {
	name: Events.VoiceStateUpdate,
	runType: 'infinity',
	async execute(client, oldState) {
		if (!oldState?.channel) return;
		// Get the queue for the voice channel
		const queue = client.distube.voices.get(oldState);

		// If the channel is empty, start a timer to leave the channel
		if (queue && isVoiceChannelEmpty(oldState)) {
			// After 5 minutes check if the channel is still empty, if it is, leave the channel
			setTimeout(async () => {
				if (queue && isVoiceChannelEmpty(oldState)) {
					await queue.leave();
				}
			}, 5 * 60 * 1000); // 5 minutes
		}
	},
};
