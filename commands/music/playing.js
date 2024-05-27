const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('playing')
		.setDescription('Return the currently playing song.')
		.setDMPermission(false)
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

		// Build Embed
		const embed = new EmbedBuilder()
			.setTitle(`**Currently Playing**`)
			.setDescription(`[${trim(song.name, 50)}](${song.url}) - \`${song.formattedDuration}\``)
			.setColor(client.color)
			.setTimestamp();

		// Send Embed
		return interaction.followUp({ embeds: [embed] });
	},
};
