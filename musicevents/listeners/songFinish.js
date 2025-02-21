const { Events } = require('distube');

module.exports = {
	name: Events.FINISH_SONG,
	runType: 'on',
	async execute(queue, client) {},
};
