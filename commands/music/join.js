const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('join')
		.setDescription('Join your current, or a specified voice channel')
		.setDMPermission(false)
		.setDefaultMemberPermissions(PermissionFlagsBits.Connect)
		.addChannelOption((option) => option.setName('channel').setDescription('The voice channel to join').setRequired(false)),
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

		const botChannel = interaction.guild.members.me.voice.channel;
		if (botChannel) return interaction.followUp("I'm already in a voice channel");

		// Check if the bot can join the channel
		if (!channel.permissionsFor(interaction.guild.members.me).has(PermissionFlagsBits.Connect)) {
			return interaction.followUp("I don't have permission to join that channel");
		}

		// Get the channel to join
		const targetChannel = interaction.options.getChannel('channel') || channel;

		// Join the channel
		await client.distube.voices.join(targetChannel);

		// Build Embed
		const embed = new EmbedBuilder()
			.setTitle(`**Joining Channel**`)
			.setDescription(`${interaction.member} requested I join ${targetChannel}.`)
			.setColor(client.color)
			.setTimestamp();

		return interaction.followUp({ embeds: [embed] });
	},
};
