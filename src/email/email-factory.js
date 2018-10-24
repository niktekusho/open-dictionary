module.exports = function (from, to, subject, content) {
	return {
		from,
		to,
		subject,
		text: content,
		html: content
	};
};
