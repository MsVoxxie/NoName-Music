const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('die')
		.setDescription('Disconnect from current voice channel')
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
		const voiceState = await interaction.guild.members.me.voice;
		if (!voiceState.channel) return interaction.followUp("I'm not in a voice channel");
		const channel = interaction.member.voice.channel;
		if (!channel) return interaction.followUp("You're not in a voice channel");
		const queue = await client.distube.getQueue(interaction);
		if (!queue) interaction.followUp('No music is currently playing');

		// Stop the song
		if (queue) {
			await client.distube.stop(interaction);
		}
		await voiceState.disconnect();

		// Build Embed
		const embed = new EmbedBuilder().setTitle(`**Disconnecting**`).setDescription(`${interaction.member} told me to die...`).setColor(client.color).setTimestamp();
		return interaction.followUp({ embeds: [embed] });
	},
};
