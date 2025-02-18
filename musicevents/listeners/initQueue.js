const { Events } = require('distube');

module.exports = {
	name: Events.INIT_QUEUE,
	runType: 'on',
	async execute(queue, client) {
		queue.volume = 25;
	},
};
