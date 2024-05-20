const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('shuffle')
		.setDescription('Shuffle the current queue.')
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
		const channel = interaction.member.voice.channel;
		if (!channel) return interaction.followUp("You're not in a voice channel");
		const queue = await client.distube.getQueue(interaction);
		if (!queue) return interaction.followUp('No music is currently playing');

		await client.distube.shuffle(interaction);

		// Build Embed
		const embed = new EmbedBuilder()
        .setTitle(`**Queue Shuffled**`)
        .setDescription(`${interaction.member} shuffled the queue.`)
        .setColor(client.color)
        .setTimestamp();
		return interaction.followUp({ embeds: [embed] });
	},
};
