const { EmbedBuilder } = require('discord.js');
const { Events } = require('distube');

module.exports = {
	name: Events.EMPTY,
	runType: 'on',
	async execute(queue, client) {
		const embed = new EmbedBuilder()
			.setColor(client.color)
			.setTitle('**Voice channel is empty.**')
			.setDescription(`Goodbye`);
			queue.textChannel.send({ embeds: [embed] })
	},
};