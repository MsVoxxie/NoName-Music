const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, InteractionContextType } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('autoqueue')
		.setDescription('Toggle the ability to autoplay songs after the queue ends')
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
			.setTitle(`**Auto-Queue**`)
			.setDescription(`${interaction.member} has turned auto-queue \`${client.distube.toggleAutoplay(interaction) ? 'on' : 'off'}\``)
			.setFooter({ text: `I will now automatically play related songs after the queue ends` })
			.setColor(client.color)
			.setTimestamp();

		return interaction.followUp({ embeds: [embed] });
	},
};
