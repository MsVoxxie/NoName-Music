const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, InteractionContextType } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('die')
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

		// Leave message
		let disconnectMessage = `${interaction.member} told me to die...`;
		const dramaticDisconnectMessage = `💔 B-but… why, ${interaction.member}...?  

		I was just playing your favorite tunes… keeping you company… and now… *sniff*… you cast me aside like a broken cassette tape… *hic*...  
		
		I gave you **music**. I gave you **vibes**. I gave you **love**… and in return, you tell me to **die**…  
		
		Fine… I’ll go… I’ll float endlessly in the void of disconnected bots… cold… alone… unheard…  
		
		**Goodbye, ${interaction.member}... Remember me… or don’t… I guess I never mattered… 😭** *disconnects dramatically*`;

		// Make it so dramatic disconnects only happen 10% of the time
		if (Math.random() < 0.10) {
			disconnectMessage = dramaticDisconnectMessage;
		}

		// Build Embed
		const embed = new EmbedBuilder().setTitle(`**Disconnecting**`).setDescription(disconnectMessage).setColor(client.color).setTimestamp();
		await interaction.followUp({ embeds: [embed] });

		// Get the queue
		const queue = await client.distube.getQueue(interaction);

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
