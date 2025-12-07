const { Innertube, UniversalCache } = require('youtubei.js');

class YouTubeExtractor {
	constructor() {
		this.yt = new Innertube({
			cache: new UniversalCache(false),
		});
	}

	validate(url) {
		return /^(https?:\/\/)?(www\.)?(youtube|youtu|youtube-nocookie|m\.youtube)\.(com|be)/.test(url);
	}

	async getInfo(url) {
		try {
			const video = await this.yt.getInfo(url);
			return {
				id: video.basic_info.id,
				title: video.basic_info.title,
				url: `https://www.youtube.com/watch?v=${video.basic_info.id}`,
				duration: video.basic_info.duration || 0,
				author: video.basic_info.channel?.name || 'Unknown',
				thumbnail: video.basic_info.thumbnail?.[0]?.url || '',
			};
		} catch (error) {
			console.error('[YouTubeExtractor] Error getting info:', error);
			throw error;
		}
	}

	async getStream(url) {
		try {
			const video = await this.yt.getInfo(url);
			const format = video.chooseFormat({ quality: 'best', type: 'audio' });
			return {
				url: format.url,
				headers: {
					'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
				},
			};
		} catch (error) {
			console.error('[YouTubeExtractor] Error getting stream:', error);
			throw error;
		}
	}
}

module.exports = new YouTubeExtractor();
