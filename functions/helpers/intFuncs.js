async function followUp(interaction, embed, textChannel) {
	let sent;
	try {
		// If the message is younger than 8 minutes, edit the reply, otherwise send a new message
		if (Date.now() - interaction.createdTimestamp < 8 * 60 * 1000) {
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
