const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, InteractionContextType } = require('discord.js');
const { progressBar } = require('../../functions/helpers/stringFormatters');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('seek')
		.setDescription('Seek to a specific time in the current song.')
		.setContexts(InteractionContextType.Guild)
		.setDefaultMemberPermissions(PermissionFlagsBits.Connect)
		.addIntegerOption((option) => option.setName('seconds').setDescription('Seconds into the song to seek to').setMinValue(1).setRequired(true)),
	options: {
		devOnly: false,
		disabled: false,
	},
	async execute(client, interaction) {
		// Defer, Things take time.
		await interaction.deferReply();

		// Get seconds to seek to
		const seekSeconds = interaction.options.getInteger('seconds');

		// Checks
		const channel = interaction.member.voice.channel;
		if (!channel) return interaction.followUp("You're not in a voice channel");
		const queue = await client.distube.getQueue(interaction);
		const song = queue.songs[0];
		if (!queue) return interaction.followUp('No music is currently playing');

		// Seek the song
		const duration = song.stream.playFromSource ? song.duration : song.stream.song.duration;
		if (seekSeconds > duration) return interaction.followUp('You cannot seek past the end of the song');
		queue.seek(seekSeconds);

		// Build Embed
		const embed = new EmbedBuilder()
			.setTitle(`**Song Seeked**`)
			.setDescription(`${interaction.member} seeked **${seekSeconds}** seconds into the song.\n${progressBar(queue.currentTime, duration)}\n\`${queue.formattedCurrentTime} / ${song.formattedDuration}\``)
			.setColor(client.color)
			.setTimestamp();

		return interaction.followUp({ embeds: [embed] });
	},
};
