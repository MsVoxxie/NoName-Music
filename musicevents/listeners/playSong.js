const { EmbedBuilder } = require('discord.js');

module.exports = {
	name: 'playSong',
	runType: 'on',
	async execute(queue, song, client) {
		// Delete the last playing embed to clean up the channel
		try {
			if (queue.lastPlaying) {
				await queue.lastPlaying.delete();
			}
		} catch (error) {}

		// Build Embed
		const embed = new EmbedBuilder()
			.setColor(client.color)
			.setTitle('**Now Playing**')
			.setImage(song.thumbnail)
			.setDescription(`**Playing»** [${song.name}](${song.url})\n**Duration»** \`${song.formattedDuration}\`\n**Requested By»** ${song.user}`)
			.setFooter({ text: `Songs Remaining: ${queue.songs.length} | Total Duration: ${queue.formattedDuration}` });

		// Send Embed
		const nowPlaying = await queue.textChannel.send({ embeds: [embed] });
		queue.lastPlaying = nowPlaying;
	},
};
