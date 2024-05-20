const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('seek')
		.setDescription('Seek to a specific time in the current song.')
		.setDMPermission(false)
		.setDefaultMemberPermissions(PermissionFlagsBits.Connect)
		.addIntegerOption((option) => option.setName('seconds').setDescription('Seconds into the song to seek to').setMinValue(1).setRequired(true)),
	options: {
		devOnly: false,
		disabled: false,
	},
	async execute(client, interaction) {
		// Defer, Things take time.
		await interaction.deferReply();

		// Get seconds to seek to
		const seekSeconds = interaction.options.getInteger('seconds');

		// Checks
		const channel = interaction.member.voice.channel;
		if (!channel) return interaction.followUp("You're not in a voice channel");
		const queue = await client.distube.getQueue(interaction);
		if (!queue) return interaction.followUp('No music is currently playing');

		// Seek the song
		queue.seek(seekSeconds);

		// Build Embed
		const embed = new EmbedBuilder()
			.setTitle(`**Song Seeked**`)
			.setDescription(`${interaction.member} seeked to **${seekSeconds}** seconds into the song.`)
			.setColor(client.color)
			.setTimestamp();

		return interaction.followUp({ embeds: [embed] });
	},
};
