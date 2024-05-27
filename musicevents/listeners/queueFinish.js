const { EmbedBuilder } = require('discord.js');

module.exports = {
	name: 'finish',
	runType: 'on',
	async execute(queue, client) {

		const embed = new EmbedBuilder()
			.setColor(client.color)
			.setTitle('**Queue Empty**')
			.setDescription(`Queue is empty. Thanks for listening.`)

		await queue.textChannel.send({ embeds: [embed] })
	},
};