const { Events } = require('distube');
const { stopFade } = require('./playSong');

module.exports = {
	name: Events.DISCONNECT,
	runType: 'on',
	async execute(queue, client) {
		// Stop and fades
		stopFade(queue);
		queue.setVolume(25);
	},
};
