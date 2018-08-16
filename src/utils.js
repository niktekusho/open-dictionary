module.exports = {
	// Function for "unboxing" arrays: if the array is empty, this function returns undefined
	unboxArray: array => {
		// Basic check
		if (Array.isArray(array)) {
			// If the array is empty return undefined
			switch (array.length) {
				case 0:
					return undefined;
				case 1:
					return array[0];
				default:
					return array;
			}
		}
		return array;
	},
	toProjection: obj => ({
		projection: {
			obj
		}
	}),
	buildMongoUrl: ({host, port, database}) => `mongodb://${host}:${port}/${database}`
};
