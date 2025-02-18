const { EmbedBuilder } = require('discord.js');
const { Events } = require('distube');

module.exports = {
	name: Events.FINISH,
	runType: 'on',
	async execute(queue, client) {
		// Emit updatePresence event
		client.emit('updatePresence');

		// Delete the last playing embed to clean up the channel
		try {
			if (queue.lastPlaying) await queue.lastPlaying.delete();
			if (queue.lastAdded) await queue.lastAdded.delete();
		} catch (error) {}

		const embed = new EmbedBuilder().setColor(client.color).setTitle('**Queue Empty**').setDescription(`Queue is empty. Thanks for listening.`);

		// Check queue repeat mode
		const currentMode = queue.repeatMode;
		if (currentMode !== 0) {
			await queue.setRepeatMode(0);
			embed.setDescription(`Queue is empty. Thanks for listening.\n\n**Repeat Mode Reset**`);
		}

		// Send Embed
		await queue.textChannel?.send({ embeds: [embed] });
		queue.voice.leave();
	},
};
