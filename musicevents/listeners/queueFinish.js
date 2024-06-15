const { EmbedBuilder } = require('discord.js');

module.exports = {
	name: 'finish',
	runType: 'on',
	async execute(queue, client) {
		// Delete the last playing embed to clean up the channel
		try {
			if (queue.lastPlaying) {
				await queue.lastPlaying.delete();
			}
		} catch (error) {}

		const embed = new EmbedBuilder().setColor(client.color).setTitle('**Queue Empty**').setDescription(`Queue is empty. Thanks for listening.`);

		// Check queue repeat mode
		const currentMode = queue.repeatMode;
		if (currentMode !== 0) {
			await queue.setRepeatMode(0);
			embed.setDescription(`Queue is empty. Thanks for listening.\n\n**Repeat Mode Reset**`);
		}

		await queue.textChannel.send({ embeds: [embed] });
	},
};
