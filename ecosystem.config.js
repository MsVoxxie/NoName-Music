module.exports = {
	apps: [
		{
			name: 'noNameMusic',
			script: './noNameMusic.js',
			watch: true,
			ignore_watch: ['*-base.js', '*-player-script.js', 'node_modules', '.git', 'package-lock.json', 'package.json'],
		},
	],
};
