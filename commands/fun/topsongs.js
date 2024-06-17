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

		// Get the most listened to songs
		const mostListened = await mostPlayed.findOne({ guildId: interaction.guild.id }).lean();
		if (!mostListened || !mostListened.songs.length) return interaction.followUp(`**${interaction.guild.name}** hasn't listened to any songs in the past 30 days.`);

		// Sort the songs by the number of times they were listened to
		const sortedSongs = mostListened.songs.sort((a, b) => b.timesPlayed - a.timesPlayed);

		// Get the top 10 songs
		const top10 = sortedSongs.slice(0, 10);

		// Format the song names
		const songNames = top10.map((song) => `[${trimString(song.songName, 30)}](${song.songUrl})`).join('\n');
		const timesPlayed = top10.map((song) => song.playCount).join('\n');

		// Create the embed
		const embed = new EmbedBuilder()
			.setTitle(`**${interaction.guild.name}**'s Most Listened To Songs`)
			.setDescription('The top 10 most listened to songs in the past 30 days.')
			.setColor(client.color)
			.setTimestamp()
			.addFields({ name: 'Song Name', value: songNames, inline: true }, { name: 'Times Played', value: timesPlayed, inline: true });

		// Send the embed
		await interaction.followUp({ embeds: [embed] });
	},
};
