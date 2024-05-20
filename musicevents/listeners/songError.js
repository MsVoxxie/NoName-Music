const { EmbedBuilder } = require('discord.js');

module.exports = {
	name: 'error',
	runType: 'on',
	async execute(channel, e, client) {
		const embed = new EmbedBuilder()
			.setColor(client.color)
			.setTitle('**An error was encountered.**')
			.setDescription(`Video may be age restricted or is not available.`);
			channel.send({ embeds: [embed] })
	},
};