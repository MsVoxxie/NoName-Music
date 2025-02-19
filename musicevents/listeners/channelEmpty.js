const { EmbedBuilder } = require('discord.js');
const { Events } = require('distube');

module.exports = {
	name: Events.EMPTY,
	runType: 'on',
	async execute(textChannel, client) {
		const embed = new EmbedBuilder()
			.setColor(client.color)
			.setTitle('**Voice channel is empty.**')
			.setDescription(`Goodbye`);
		await textChannel.send({ embeds: [embed] });
	},
};