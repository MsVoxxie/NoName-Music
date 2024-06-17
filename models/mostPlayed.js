const { Schema, model } = require('mongoose');

const songSchema = new Schema({
	songName: { type: String, required: true },
	songAuthor: { type: String, required: true },
	songUrl: { type: String, required: true },
	playCount: { type: Number, default: 0, required: true },
	lastListened: { type: Date, default: Date.now },
});

const mostPlayedSchema = new Schema({
	guildId: { type: String, required: true },
	totalPlays: { type: Number, default: 0, required: true },
	songs: [songSchema],
});

module.exports = model('mostPlayed', mostPlayedSchema);
