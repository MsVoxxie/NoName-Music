function trimString(str, max) {
	return str.length > max ? `${str.slice(0, max - 3)}...` : str;
}

function progressBar(current, total, size = 20) {
	const percentage = Math.min(Math.max(current / total, 0), 1); // Clamps between 0-1
	const filledLength = Math.round(size * percentage);

	// Create the progress bar with a filled square as an indicator
	const bar = `⟪${'▬'.repeat(filledLength)}▽${'▬'.repeat(size - filledLength - 1)}⟫`;

	return `${bar} ${Math.round(percentage * 100)}%`;
}

module.exports = {
	trimString,
	progressBar,
};
