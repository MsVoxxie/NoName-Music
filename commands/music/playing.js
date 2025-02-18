const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, InteractionContextType } = require('discord.js');
const { progressBar } = require('../../functions/helpers/stringFormatters');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('playing')
		.setDescription('Return the currently playing song.')
		.setContexts(InteractionContextType.Guild)
		.setDefaultMemberPermissions(PermissionFlagsBits.Connect),
	options: {
		devOnly: false,
		disabled: false,
	},
	async execute(client, interaction) {
		// Defer, Things take time.
		await interaction.deferReply();

		// Checks
		const trim = (str, max) => (str.length > max ? `${str.slice(0, max - 3)}...` : str);
		const queue = await client.distube.getQueue(interaction);
		if (!queue) return interaction.followUp('No music is currently playing!');

		// Get the currently playing song
		const song = queue.songs[0];
		const duration = song.stream.playFromSource ? song.duration : song.stream.song.duration;

		// Build Embed
		const embed = new EmbedBuilder()
			.setTitle(`**Currently Playing**`)
			.setDescription(`[${trim(song.name, 50)}](${song.url})\nRequested by: ${song.user}\n${progressBar(queue.currentTime, duration)}\n\`${queue.formattedCurrentTime} / ${song.formattedDuration}\``)
			.setColor(client.color)
			.setTimestamp();

		// Send Embed
		return interaction.followUp({ embeds: [embed] });
	},
};
