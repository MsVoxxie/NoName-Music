const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('jump')
		.setDescription('Jump to a specific song in the queue.')
		.setDMPermission(false)
		.setDefaultMemberPermissions(PermissionFlagsBits.Connect)
		.addIntegerOption((option) => option.setName('song').setDescription('Song number to jump to').setMinValue(2).setRequired(true)),
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

		// Get the song number
		const songNumber = interaction.options.getInteger('song');

		// Check if the song number is valid
		if (songNumber > queue.songs.length) return interaction.followUp('Invalid song number');

		// Jump to the song
		await client.distube.jump(interaction, songNumber - 1);

		// Build Embed
		const embed = new EmbedBuilder()
			.setTitle(`**Song Jumped**`)
			.setDescription(`${interaction.member} jumped to song number ${songNumber}.`)
			.setColor(client.color)
			.setTimestamp();

		return interaction.followUp({ embeds: [embed] });
	},
};
