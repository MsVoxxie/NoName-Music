async function followUp(interaction, embed, textChannel) {
	let sent;
	try {
		if (Date.now() - interaction.createdTimestamp < 15 * 60 * 1000) {
			try {
				sent = await interaction.editReply({ embeds: [embed], fetchReply: true });
			} catch (error) {
				sent = await interaction.followUp({ embeds: [embed], fetchReply: true });
			}
		} else {
			sent = await textChannel.send({ embeds: [embed] });
		}
	} catch (error) {
		console.error(error);
	}
	return sent;
}

module.exports = {
	followUp,
};
