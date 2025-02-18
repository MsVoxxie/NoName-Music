const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, InteractionContextType } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('fastforward')
		.setDescription('Fast forward the current song.')
		.setContexts(InteractionContextType.Guild)
		.setDefaultMemberPermissions(PermissionFlagsBits.Connect)
		.addIntegerOption((option) => option.setName('seconds').setDescription('Number of seconds to fast forward').setRequired(true)),
	options: {
		devOnly: false,
		disabled: false,
	},
	async execute(client, interaction) {
		// Defer, Things take time.
		await interaction.deferReply();

		// Get seconds to fast forward
		const ffSeconds = interaction.options.getInteger('seconds');

		// Checks
		const channel = interaction.member.voice.channel;
		if (!channel) return interaction.followUp("You're not in a voice channel");
		const queue = await client.distube.getQueue(interaction);
		if (!queue) return interaction.followUp('No music is currently playing');

		// Fast forward the song
		queue.seek(queue.currentTime + ffSeconds);

		// Build Embed
		const embed = new EmbedBuilder()
			.setTitle(`**Song Fast Forwarded**`)
			.setDescription(`${interaction.member} fast forwarded by **${ffSeconds}** seconds.`)
			.setColor(client.color)
			.setTimestamp();

		return interaction.followUp({ embeds: [embed] });
	},
};
