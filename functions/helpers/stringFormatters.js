function trimString(str, length) {
	const sanitizedStr = str.replace(/[\[\]]/g, '\\$&');
	if (sanitizedStr.length <= length) return sanitizedStr;
	const truncated = sanitizedStr.slice(0, sanitizedStr.lastIndexOf(' ', length)) + '...';
	return truncated.replace(/\\([\[\]])/g, '$1');
}

function progressBar(current, total, size = 20) {
	const percentage = Math.min(Math.max(current / total, 0), 1); // Clamps between 0-1
	const filledLength = Math.round(size * percentage);
	const emptyLength = size - filledLength - 1;

	// Create the progress bar with a filled square as an indicator
	const bar = `⟪${'▬'.repeat(filledLength)}▽${'▬'.repeat(Math.max(emptyLength, 0))}⟫`;

	return `${bar} ${Math.round(percentage * 100)}%`;
}

module.exports = {
	trimString,
	progressBar,
};
