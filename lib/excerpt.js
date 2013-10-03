'use strict';

module.exports = function(text) {
	if (typeof text !== 'string') return false;

	var charLimit = 200;

	// While the last character isn't a space, keep trimming to not cut a word in half
	while(!/\s/.test(text.charAt(charLimit)) && charLimit) {
		charLimit--;
	}

	return text.substring(0, charLimit).trim() + '…';
};
