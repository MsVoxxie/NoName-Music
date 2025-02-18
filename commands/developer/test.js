const { SlashCommandBuilder, InteractionContextType } = require('discord.js');
const { ActivityType, PresenceUpdateStatus } = require('discord.js');


module.exports = {
	data: new SlashCommandBuilder().setName('test').setDescription('Join your current, or a specified voice channel').setContexts(InteractionContextType.Guild),
	options: {
		devOnly: true,
		disabled: false,
	},
	async execute(client, interaction) {
		await client.user.setPresence({ activities: [{ name: 'Idle' }], status: PresenceUpdateStatus.Idle });
	},
};
