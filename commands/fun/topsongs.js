const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, InteractionContextType } = require('discord.js');
const { trimString } = require('../../functions/helpers/stringFormatters');
const mostPlayed = require('../../models/mostPlayed');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('topsongs')
		.setDescription('Displays the most listened-to songs in the server.')
		.setContexts(InteractionContextType.Guild)
		.setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),
	options: { devOnly: false, disabled: false },

	async execute(client, interaction) {
		await interaction.deferReply();

		const zW = ' '; // Zero-width space
		const mostListened = await mostPlayed.findOne({ guildId: interaction.guild.id }).lean();
		if (!mostListened?.songs?.length) {
			return interaction.followUp(`**${interaction.guild.name}** hasn't listened to any songs in the past 30 days.`);
		}

		const sortedSongs = mostListened.songs.sort((a, b) => b.playCount - a.playCount);
		let songNames = sortedSongs.slice(0, 15).map((song, i) => {
			const rank = i === 0 ? '🏅' : `**${zW}${i + 1}.**`;
			return `${rank} [${trimString(song.songName, 25)}](${song.songUrl}) **- ${song.playCount}** plays`;
		});

		// Ensure the text doesn't exceed Discord's 1024-char limit per field
		let fields = [];
		let chunk = '';
		for (let line of songNames) {
			if ((chunk + '\n' + line).length > 1024) {
				fields.push({ name: zW, value: chunk });
				chunk = line;
			} else {
				chunk += `\n${line}`;
			}
		}
		if (chunk) fields.push({ name: zW, value: chunk });

		const embed = new EmbedBuilder()
			.setTitle(`${interaction.guild.name}'s Most Listened To Songs`)
			.setThumbnail(interaction.guild.iconURL())
			.setColor(client.color)
			.setTimestamp()
			.setFooter({ text: `Total Plays • ${mostListened.totalPlays}` })
			.addFields(fields);

		await interaction.followUp({ embeds: [embed] });
	},
};
