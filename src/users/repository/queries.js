function todayAtMidnight() {
	const now = new Date();
	now.setUTCHours(0, 0, 0, 0);
	return now;
}

module.exports = mongodb => ({
	existingUser: (username, email) => ({
		$or: [{username}, {email}]
	}),
	equalsUsername: username => ({
		username
	}),
	equalsEmail: email => ({
		email
	}),
	createdToday: () => ({
		_id: {
			$gte: mongodb.ObjectID.createFromTime(todayAtMidnight())
		}
	})
});
