const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { trimString } = require('../../functions/helpers/stringFormatters');
const mostPlayed = require('../../models/mostPlayed');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('topsongs')
		.setDescription('The most listened to songs in the server.')
		.setDMPermission(false)
		.setDefaultMemberPermissions(PermissionFlagsBits.Connect),
	options: {
		devOnly: false,
		disabled: false,
	},
	async execute(client, interaction) {
		// Defer, Things take time.
		await interaction.deferReply();

		// Zero space character
		const zW = ' ';

		// Get the most listened to songs
		const mostListened = await mostPlayed.findOne({ guildId: interaction.guild.id }).lean();
		if (!mostListened || !mostListened.songs.length) return interaction.followUp(`**${interaction.guild.name}** hasn't listened to any songs in the past 30 days.`);

		// Sort the songs by the number of times they were listened to
		const sortedSongs = mostListened.songs.sort((a, b) => b.playCount - a.playCount);

		// Get the top 10 songs
		const top10 = sortedSongs.slice(0, 10);

		// Format the song names
		const songNames = top10.map((song, i) => {
			// Make most plays a crown otherwise be i
			let mostPlays = '';
			if (i === 0) mostPlays = '🏅';
			else mostPlays = `**${zW}${i + 1}.**`;
			// Return the formatted string
			return `${mostPlays} [${trimString(song.songName, 25)}](${song.songUrl}) **-** **${song.playCount}** plays`;
		});

		// Create the embed
		const embed = new EmbedBuilder()
			.setTitle(`**${interaction.guild.name}**'s Most Listened To Songs`)
			.setThumbnail(interaction.guild.iconURL())
			.setColor(client.color)
			.setTimestamp()
			.setFooter({ text: `Total Plays • ${mostListened.totalPlays}` })
			.addFields({ name: 'Top songs - Prev 30 Days', value: songNames.join('\n'), inline: true });

		// Send the embed
		await interaction.followUp({ embeds: [embed] });
	},
};
