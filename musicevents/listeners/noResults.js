const { EmbedBuilder } = require('discord.js');
const queue = require('../../commands/music/queue');

module.exports = {
	name: 'searchNoResult',
	runType: 'on',
	async execute(message, query, client) {
		const embed = new EmbedBuilder()
			.setColor(client.color)
			.setTitle('**No Results Found**')
			.setDescription(`No results found for \`${query}\``);
			message.channel.send({ embeds: [embed] })
	},
};