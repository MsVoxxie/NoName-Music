const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, InteractionContextType } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('autoplay')
		.setDescription('Toggle autoplay for the guild.')
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
		const channel = interaction.member.voice.channel;
		if (!channel) return interaction.followUp("You're not in a voice channel");
		const queue = await client.distube.getQueue(interaction);
		if (!queue) return interaction.followUp('No music is currently playing');

		// Build Embed
		const embed = new EmbedBuilder()
			.setTitle(`**Autoplay**`)
			.setDescription(`${interaction.member} toggled autoplay for the guild.\n**Autoplay is**: \`${client.distube.toggleAutoplay(interaction) ? 'On' : 'Off'}\``)
			.setColor(client.color)
			.setTimestamp();

		return interaction.followUp({ embeds: [embed] });
	},
};
