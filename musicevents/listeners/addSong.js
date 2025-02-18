const { EmbedBuilder } = require('discord.js');
const { Events } = require('distube');

module.exports = {
	name: Events.ADD_SONG,
	runType: 'on',
	async execute(queue, song, client) {
		const embed = new EmbedBuilder()
			.setColor(client.color)
			.setTitle('**Song added to Queue**')
			.setImage(song.thumbnail)
			.setDescription(`**Queued»** [${song.name}](${song.url})\n**Duration»** \`${song.formattedDuration}\`\n**Added By»** ${song.user}`);

		queue.lastAdded = await song.metadata.interaction.editReply({
			embeds: [embed],
		});
	},
};
