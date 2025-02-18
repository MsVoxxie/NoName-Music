const { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, StringSelectMenuBuilder, InteractionContextType } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('repeat')
		.setDescription('Set the repeat mode for this guild.')
		.setContexts(InteractionContextType.Guild)
		.setDefaultMemberPermissions(PermissionFlagsBits.Connect),
	options: {
		devOnly: false,
		disabled: false,
	},
	async execute(client, interaction) {
		// Definitions
		const queue = await client.distube.getQueue(interaction);
		if (!queue) return interaction.reply('No music is currently playing!');
		const channel = await interaction.member.voice.channel;
		if (!channel) return interaction.reply("You're not in a voice channel.");

		// Defer, Things take time.
		await interaction.deferReply({});

		// Create a modal to select the repeat mode
		const selectMenu = new ActionRowBuilder().addComponents(
			new StringSelectMenuBuilder()
				.setCustomId('repeatmode')
				.setPlaceholder('Select a repeat mode')
				.setMinValues(1)
				.setMaxValues(1)
				.addOptions([
					{
						label: 'Off',
						value: '0',
						description: 'Turn off repeat mode',
					},
					{
						label: 'Repeat Song',
						value: '1',
						description: 'Repeat the current song',
					},
					{
						label: 'Repeat Queue',
						value: '2',
						description: 'Repeat the entire queue',
					},
				])
		);

		// Send the select menu
		await interaction.followUp({ content: `${interaction.user} is selecting a loop mode.`, components: [selectMenu] });

		// Add a listener for the select menu
		const filter = (i) => i.customId === 'repeatmode' && i.user.id === interaction.user.id;
		const collector = interaction.channel.createMessageComponentCollector({ filter, time: 90 * 1000 });

		collector.on('collect', async (i) => {
			await i.deferUpdate();

			// Set the repeat mode
			const repeatMode = i.values[0];
			await queue.setRepeatMode(Number(repeatMode));

			// Humanize the repeat mode
			let humanizedRepeatMode;
			switch (Number(repeatMode)) {
				case 0:
					humanizedRepeatMode = 'Off';
					break;
				case 1:
					humanizedRepeatMode = 'Repeat Song';
					break;
				case 2:
					humanizedRepeatMode = 'Repeat Queue';
					break;
			}

			// Send a message to let the user know the repeat mode has been set
			await interaction.editReply({ content: `Repeat mode has been set to **${humanizedRepeatMode}**.`, components: [] });
			collector.stop();
			return;
		});

		collector.on('end', async (c, r) => {
			if (r !== 'time') return;
			await interaction.editReply({ content: 'You did not select a repeat mode in time.', components: [] });
		});
	},
};
