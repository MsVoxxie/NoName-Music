const { EmbedBuilder } = require('discord.js');

module.exports = {
	name: 'empty',
	runType: 'on',
	async execute(channel, client) {
		const embed = new EmbedBuilder()
			.setColor(client.color)
			.setTitle('**Voice channel is empty.**')
			.setDescription(`Goodbye`);
			channel.send({ embeds: [embed] })
	},
};