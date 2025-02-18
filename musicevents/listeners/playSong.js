const { EmbedBuilder } = require('discord.js');
const mostPlayed = require('../../models/mostPlayed');
const { followUp } = require('../../functions/helpers/intFuncs');
const { Events } = require('distube');

module.exports = {
	name: Events.PLAY_SONG,
	runType: 'on',
	async execute(queue, song, client) {
		// Emit updatePresence event
		client.emit('updatePresence');

		// Delete the last playing embed to clean up the channel
		try {
			if (queue.lastPlaying) await queue.lastPlaying.delete();
		} catch (error) {}

		// Build Embed
		const embed = new EmbedBuilder()
			.setColor(client.color)
			.setTitle('**Now Playing**')
			.setImage(song.thumbnail)
			.setDescription(`**Playing»** [${song.name}](${song.url})\n**Duration»** \`${song.formattedDuration}\`\n**Requested By»** ${song.user}`)
			.setFooter({ text: `Songs Remaining: ${queue.songs.length} | Total Duration: ${queue.formattedDuration}` });

		// Send Embed
		queue.lastPlaying = await followUp(song.metadata.interaction, embed, queue.textChannel);

		//? This is all for the most played songs feature from here down
		// Check if the song is already in the database, if so increment the playCount by 1
		const songExists = await mostPlayed.findOne({
			guildId: queue.textChannel.guild.id,
			'songs.songUrl': song.url,
		});

		try {
			// Increment the totalPlays by 1
			await mostPlayed.updateOne({ guildId: queue.textChannel.guild.id }, { $inc: { totalPlays: 1 } }, { upsert: true });

			// If the song is in the database, increment the playCount by 1
			if (songExists) {
				await mostPlayed.updateOne(
					{
						guildId: queue.textChannel.guild.id,
						'songs.songName': song.name ? song.name : 'Unknown Name...',
						'songs.songAuthor': song.uploader.name ? song.uploader.name : 'Unknown Author...',
					},
					{ $inc: { 'songs.$.playCount': 1 }, lastListened: Date.now() },
					{ upsert: true }
				);
			} else {
				// If the song is not in the database, add it to the database with a playCount of 1
				await mostPlayed.updateOne(
					{ guildId: queue.textChannel.guild.id },
					{
						$addToSet: {
							songs: {
								songName: song.name ? song.name : 'Unknown Name...',
								songAuthor: song.uploader.name ? song.uploader.name : 'Unknown Author...',
								songUrl: song.url ? song.url : 'Unknown URL...',
								playCount: 1,
							},
						},
					},
					{ upsert: true }
				);
			}
		} catch (error) {
			console.log('Error adding song to database: ', error);
		}
	},
};
