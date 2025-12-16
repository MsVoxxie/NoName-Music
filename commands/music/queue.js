const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, InteractionContextType } = require('discord.js');
const { trimString } = require('../../functions/helpers/stringFormatters');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('queue')
		.setDescription('Return the current music queue.')
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
		const queue = await client.distube.getQueue(interaction);
		if (!queue) return interaction.followUp('No music is currently playing!');

		// Format Queue
		let formattedQueue = queue.songs.map((song, index) => {
			const trimmedName = trimString(song.name, 50); // Trimming function remains
			return `**${index + 1}**. [${trimmedName}](${song.url}) - \`${song.formattedDuration}\``;
		});
		// slice the queue if it's too long
		if (formattedQueue.length > 20) {
			const slicedQueue = formattedQueue.slice(0, 20);
			slicedQueue.push(`\nAnd **${queue.songs.length - 20}** more...`);
			formattedQueue = slicedQueue;
		}

		// Build Embed
		const embed = new EmbedBuilder()
			.setTitle(`**${interaction.guild.name}'s Current Queue**`)
			.setDescription(formattedQueue.join('\n'))
			.setColor(client.color)
			.setFooter({ text: `Queue Duration: ${queue.formattedDuration}` });
		return interaction.followUp({ embeds: [embed] });
	},
};
