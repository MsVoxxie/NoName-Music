async function followUp(interaction, embed, textChannel) {
	let sent;
	try {
		if (Date.now() - interaction.createdTimestamp < 15 * 60 * 1000) {
			sent = await interaction.followUp({ embeds: [embed], fetchReply: true });
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
