module.exports = function() {
	var users = [];

	return {
		addUser: function (user) {
			users.push(user);
		},

		removeUser: function(user) {
			var index = users.indexOf(user);
			users.splice(index, 1);
		},

		allUsers: function() {
			return users;
		}
	}
};

module.exports['@singleton'] = true;