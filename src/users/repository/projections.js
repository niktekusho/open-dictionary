module.exports = ({
	toProjection
}) => {
	return {
		minimal: toProjection({
			username: 1,
			roles: 1
		})
	};
};
