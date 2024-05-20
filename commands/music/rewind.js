const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rewind')
		.setDescription('Rewind the current song.')
		.setDMPermission(false)
		.setDefaultMemberPermissions(PermissionFlagsBits.Connect)
		.addIntegerOption((option) => option.setName('seconds').setDescription('Number of seconds to rewind').setRequired(true)),
	options: {
		devOnly: false,
		disabled: false,
	},
	async execute(client, interaction) {
		// Defer, Things take time.
		await interaction.deferReply();

		// Get seconds to rewind
		const rwSeconds = interaction.options.getInteger('seconds');

		// Checks
		const channel = interaction.member.voice.channel;
		if (!channel) return interaction.followUp("You're not in a voice channel");
		const queue = await client.distube.getQueue(interaction);
		if (!queue) return interaction.followUp('No music is currently playing');

		// Rewind the song
		queue.seek(queue.currentTime - rwSeconds);

		// Build Embed
		const embed = new EmbedBuilder()
			.setTitle(`**Song Rewinded**`)
			.setDescription(`${interaction.member} rewinded by **${rwSeconds}** seconds.`)
			.setColor(client.color)
			.setTimestamp();

		return interaction.followUp({ embeds: [embed] });
	},
};
