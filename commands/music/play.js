const { SlashCommandBuilder, PermissionFlagsBits, InteractionContextType } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Play some music')
		.addStringOption((option) => option.setName('query').setDescription('Query to search for.').setRequired(true))
		.setContexts(InteractionContextType.Guild)
		.setDefaultMemberPermissions(PermissionFlagsBits.Connect),
	options: {
		devOnly: false,
		disabled: false,
	},
	async execute(client, interaction) {
		const channel = await interaction.member.voice.channel;
		if (!channel) return interaction.reply("You're not in a voice channel.");
		const rawQuery = interaction.options.getString('query');

		// Detect if the input looks like a YouTube playlist URL
		let isYouTubePlaylist = false;
		try {
			const url = new URL(rawQuery);
			const host = url.hostname.replace('www.', '');
			const hasPlaylistParam = url.searchParams.has('list');
			const isYouTubeHost = host === 'youtube.com' || host === 'youtu.be' || host === 'music.youtube.com';
			if (isYouTubeHost && hasPlaylistParam) isYouTubePlaylist = true;
		} catch {
			// Not a URL, ignore
		}

		const query = rawQuery;

		// This regex checks for youtube URLs and captures the start time if present
		const youtubeTimeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=[\w-]+|youtu\.be\/[\w-]+)(?:[^\s]*?[&?])t=(\d+)/;
		const youtubeStartTime = query.match(youtubeTimeRegex)?.[1] || null;

		// Defer, Things take time.
		await interaction.deferReply();

		// If it looks like a YouTube playlist URL, let the user know
		if (isYouTubePlaylist) {
			await interaction.followUp({ content: 'Loading playlist, this may take a moment...' });
		}

		// Queue the song
		try {
			await client.distube.play(channel, query, {
				member: interaction.member,
				textChannel: interaction.channel,
				metadata: { interaction, autoSeek: youtubeStartTime },
			});

			// Catch any errors
		} catch (error) {
			return interaction.followUp({ content: `${error.message}` }).then((m) => {
				setTimeout(() => m.delete(), 60 * 1000);
			});
		}
	},
};
