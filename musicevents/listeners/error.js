const { EmbedBuilder } = require('discord.js');
const { Events } = require('distube');
const { followUp } = require('../../functions/helpers/intFuncs');

module.exports = {
	name: Events.ERROR,
	runType: 'on',
	async execute(error, queue, song, client) {
		const embed = new EmbedBuilder().setColor(client.color).setTitle('**An error was encountered.**').setDescription(`**Error:** \`${error.message}\``);

		if (song) {
			followUp(song.metadata.interaction, embed, queue.textChannel);
		} else if (queue.textChannel) {
			followUp(queue.textChannel, embed, queue.textChannel);
		} else {
			console.error(error);
		}
	},
};
