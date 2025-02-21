const { Events } = require('distube');

module.exports = {
	name: Events.FFMPEG_DEBUG,
	runType: 'on',
	async execute(string, client) {
		// console.log(string);
	},
};
