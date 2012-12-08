var Vote = Backbone.Model.extend({
	url: '/vote'
});

var VoteView = Backbone.View.extend({
	tagName: 'div',
	className: 'vote',

	events: {
		'click .dislike': 'dislike',
		'click .like': 'like'
	},

	dislike: function() {
		this.model.set('choose', -1);
		this.model.save();
		return false;
	},

	like: function() {
		this.model.set('choose', 1);
		this.model.save();
		return false;
	},

	render: function() {
		this.$el.html('<div class="like"/><div class="text">' + 
			this.model.get('choose') + '</div><div class="dislike"/>');
		return this;
	}
});