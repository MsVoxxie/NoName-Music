const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('queue_search')
		.setDescription('Searches the current queue.')
		.setDMPermission(false)
		.setDefaultMemberPermissions(PermissionFlagsBits.Connect)
		.addStringOption((option) => option.setName('search').setDescription('The search term to look for in the queue.').setRequired(true)),
	options: {
		devOnly: false,
		disabled: false,
	},
	async execute(client, interaction) {
		// Defer, Things take time.
		await interaction.deferReply();

		// Checks
		const trim = (str, max) => (str.length > max ? `${str.slice(0, max - 3)}...` : str);
		const queue = await client.distube.getQueue(interaction);
		if (!queue) return interaction.followUp('No media is currently playing!');

		// Get Search Term
		const searchTerm = interaction.options.getString('search');

		// Search Queue
		const searchResults = queue.songs.filter((song) => song.name.toLowerCase().includes(searchTerm.toLowerCase()));

		// If no results are found, return a message
		if (!searchResults.length) return interaction.followUp(`No results found for **${searchTerm}** in the queue.`);

		// Get the position of the search term from the queue
		const position = queue.songs.findIndex((song) => song.name.toLowerCase().includes(searchTerm.toLowerCase()));

		console.log(searchResults);

		// Build Embed with the result and position of the search term
		const embed = new EmbedBuilder()
			.setTitle('Queue Search')
			.setColor(client.color)
			.setDescription(
				`Found **${searchResults.length}** results for **${searchTerm}** in the queue.\n${searchResults
					.map((song) => `**${position + 1}.** [${trim(song.name, 50)}](${song.url})`)
					.join('\n')}`
			);

		// Send Embed
		return interaction.followUp({ embeds: [embed] });
	},
};
