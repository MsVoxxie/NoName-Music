const { EmbedBuilder } = require('discord.js');
const { Events } = require('distube');

module.exports = {
	name: Events.ADD_LIST,
	runType: 'on',
	async execute(queue, playlist, client) {
		const embed = new EmbedBuilder()
			.setColor(client.color)
			.setTitle('**Playlist added to Queue**')
			.setImage(playlist.thumbnail)
			.setDescription(`**Queued»** [${playlist.name}](${playlist.url})\n**Song Count** \`${playlist.songs.length}\`\n**Added By»** ${playlist.user}`);

		queue.lastAdded = await playlist.metadata.interaction.editReply({ embeds: [embed] });
	},
};
