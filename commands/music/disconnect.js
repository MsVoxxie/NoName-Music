const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, InteractionContextType } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('disconnect')
		.setDescription('Disconnect from current voice channel')
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
		const voiceState = await interaction.guild.members.me.voice;
		if (!voiceState.channel) return interaction.followUp("I'm not in a voice channel");

		const channel = interaction.member.voice.channel;
		const botChannel = interaction.guild.members.me.voice.channel;

		if (channel !== botChannel) return interaction.followUp("You're not in the same voice channel as me");
		if (!channel) return interaction.followUp("You're not in a voice channel");

		// Get the queue
		const queue = await client.distube.getQueue(interaction);

		// Build Embed
		const embed = new EmbedBuilder().setTitle(`**Disconnecting**`).setDescription(`${interaction.member} told me to disconnect.`).setColor(client.color).setTimestamp();
		await interaction.followUp({ embeds: [embed] });

		// Stop the song
		if (queue) {
			await client.distube.stop(interaction);
		}
		await client.distube.voices.leave(interaction);

		// Delete the last playing embed to clean up the channel
		try {
			if (queue.lastPlaying) await queue.lastPlaying.delete();
			if (queue.lastAdded) await queue.lastAdded.delete();
		} catch (error) {}
	},
};
