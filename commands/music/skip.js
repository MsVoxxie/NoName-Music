const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, InteractionContextType } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Skip the current track.')
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

		// Check if there is only one song in the queue
		if (queue.songs.length === 1) return interaction.followUp('There is only one song in the queue');

		// Skip the song
		await client.distube.skip(interaction);

		// Build Embed
		const embed = new EmbedBuilder()
        .setTitle(`**Song Skipped**`)
        .setDescription(`${interaction.member} skipped the current song.`)
        .setColor(client.color)
        .setTimestamp();

		return interaction.followUp({ embeds: [embed] })
	},
};
