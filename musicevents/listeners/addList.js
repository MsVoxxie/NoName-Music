const { EmbedBuilder } = require('discord.js');

module.exports = {
	name: 'addList',
	runType: 'on',
	async execute(queue, playlist, client) {
        console.log('Playlist added to queue');
		const embed = new EmbedBuilder()
			.setColor(client.color)
			.setTitle('**Playlist added to Queue**')
			.setImage(playlist.thumbnail)
			.setDescription(`**Queued»** [${playlist.name}](${playlist.url})\n**Song Count** \`${playlist.songs.length}\`\n**Added By»** ${playlist.user}`);

		queue.textChannel.send({ embeds: [embed] });
	},
};
