const { Events } = require('distube');
const { stopFade } = require('./playSong');

module.exports = {
	name: Events.FINISH_SONG,
	runType: 'on',
	async execute(queue, client) {
		// Stop fade outs
		stopFade(queue);
        queue.setVolume(25);
	},
};
