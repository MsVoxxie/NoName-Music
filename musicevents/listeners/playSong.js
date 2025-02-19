const { EmbedBuilder } = require('discord.js');
const mostPlayed = require('../../models/mostPlayed');
const { followUp } = require('../../functions/helpers/intFuncs');
const { Events } = require('distube');

// Global variable to store fade data
const queueTrackers = new Map(); // Store fade data per queue
const defaultVolume = 25; // Default volume after fading

const stopFade = (queue) => {
	if (!queue || !queueTrackers.has(queue.id)) return;

	const { progressCheck } = queueTrackers.get(queue.id);
	if (progressCheck) {
		clearInterval(progressCheck);
	}

	queue.setVolume(defaultVolume); // Reset volume
	queueTrackers.delete(queue.id); // Clean up tracker
};

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

		// Check if the song has an autoSeek parameter and autoplay is disabled
		if (song.metadata.autoSeek && !queue.autoplay) {
			embed.setDescription(
				`**Playing»** [${song.name}](${song.url})\n**Duration»** \`${song.formattedDuration}\`\n**Auto Seek»** \`${song.metadata.autoSeek}\`s\n**Requested By»** ${song.user}`
			);
			await queue.seek(Number(song.metadata.autoSeek));
		}

		// Send Embed
		queue.lastPlaying = await followUp(song.metadata.interaction, embed, queue.textChannel);

		//! EXPERIMENTAL
		//! Song Volume Fade
		//! Intented to emulate Spotify's volume fade out effect

		const fadeDuration = 7; // Seconds before song ends to start fading
		const fadeSteps = 25; // Smoothness of the fade, higher = smoother
		const fadeInterval = (fadeDuration * 1000) / fadeSteps;
		const k = 0.215; // Decay, higher = faster fade
		let currentVolume = queue.volume;

		if (queueTrackers.has(queue.id)) {
			stopFade(queue); // Stop any existing fade for this queue
		}

		queueTrackers.set(queue.id, { progressCheck: null, fadeActive: false });

		const fadeOut = async () => {
			const tracker = queueTrackers.get(queue.id);
			if (!tracker || tracker.fadeActive) return;
			tracker.fadeActive = true;

			for (let step = 0; step <= fadeSteps; step++) {
				if (!queue.songs[0] || queue.currentTime >= song.duration - 0.5) break;

				const newVolume = currentVolume * Math.exp(-k * step);
				queue.setVolume(Math.max(newVolume, 1)); // Prevent full silence
				await new Promise((res) => setTimeout(res, fadeInterval));
			}

			tracker.fadeActive = false;
		};

		// Monitor song progress every second
		const progressCheck = setInterval(() => {
			const tracker = queueTrackers.get(queue.id);
			if (!tracker) return;

			if (!queue.songs[0]) {
				stopFade(queue);
				return;
			}

			const timeLeft = song.duration - queue.currentTime;
			if (timeLeft <= fadeDuration && !tracker.fadeActive) {
				fadeOut();
			}
		}, 1000);

		// Save tracker for this queue
		queueTrackers.set(queue.id, { progressCheck, fadeActive: false });

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
	stopFade, // Export stopFade properly
};
