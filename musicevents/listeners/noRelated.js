const { EmbedBuilder } = require('discord.js');
const { Events } = require('distube');

module.exports = {
	name: Events.NO_RELATED,
	runType: 'on',
	async execute(queue, error, client) {
		const embed = new EmbedBuilder().setColor(client.color).setTitle('**No Results Found**').setDescription(`**Error:** \`${error.message}\``);
		queue.textChannel?.send({ embeds: [embed] });
	},
};
