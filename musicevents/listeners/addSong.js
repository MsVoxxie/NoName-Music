const { EmbedBuilder } = require('discord.js');

module.exports = {
	name: 'addSong',
	runType: 'on',
	async execute(queue, song, client) {
		const embed = new EmbedBuilder()
			.setColor(client.color)
			.setTitle('**Song added to Queue**')
			.setImage(song.thumbnail)
			.setDescription(`**Queued»** [${song.name}](${song.url})\n**Duration»** \`${song.formattedDuration}\`\n**Added By»** ${song.user}`);

		queue.lastAdded = await queue.textChannel.send({ embeds: [embed] });
	},
};
