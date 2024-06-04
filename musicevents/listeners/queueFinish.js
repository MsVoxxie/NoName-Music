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
		const embed = new EmbedBuilder()
			.setColor(client.color)
			.setTitle('**Queue Empty**')
			.setDescription(`Queue is empty. Thanks for listening.`)

		await queue.textChannel.send({ embeds: [embed] })
	},
};