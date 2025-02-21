const { Events } = require('distube');

module.exports = {
	name: Events.DISCONNECT,
	runType: 'on',
	async execute(queue, client) {},
};
