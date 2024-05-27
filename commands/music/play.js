const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Play some music')
		.addStringOption((option) => option.setName('query').setDescription('Query to search for.').setRequired(true))
		.setDMPermission(false)
		.setDefaultMemberPermissions(PermissionFlagsBits.Connect),
	options: {
		devOnly: false,
		disabled: false,
	},
	async execute(client, interaction) {
		const channel = await interaction.member.voice.channel;
		if (!channel) return interaction.reply("You're not in a voice channel.");
		const query = interaction.options.getString('query');

		// Defer, Things take time.
		await interaction.deferReply({});

		// Let the user know the song is being queued
		interaction.followUp({ content: `Searching for\n**<${query}>**...` });

		try {
			await client.distube.play(channel, query, {
				member: interaction.member,
				textChannel: interaction.channel,
				interaction,
			});

			// Lower default volume
			await client.distube.setVolume(interaction, 25);
		} catch (error) {
			return interaction.followUp({ content: `${error.message}` }).then((m) => {
				setTimeout(() => m.delete(), 60 * 1000);
			});
		}
	},
};
