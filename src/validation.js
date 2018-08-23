class Validation {
	constructor(valid, details = {}) {
		this._valid = valid;
		this._details = details;
	}

	get valid() {
		return this._valid;
	}

	get details() {
		return this._details;
	}
}

module.exports = Validation;
