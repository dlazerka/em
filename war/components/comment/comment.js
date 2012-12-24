/**
 * Comments model and views.
 * 
 * @author Andrey Mormysh
 * @author jauhen@gmail.com (Jauhen Kutsuk)
 */

/** Comment model. */
var Comment = Backbone.Model.extend({
  defaults: {
    memeId: null,
    user: null,
    text: null,
    timestamp: null
  },

  url: '/comments'
});

/** List of comments. */
var Comments = Backbone.Collection.extend({
  model: Comment,
  memeId: null,
  url: '/comments'
});

/** Single comment view. */
var CommentView = Backbone.View.extend({
  tagName: 'div',
  className: 'comment',

  /** @type {jQuery.promise} */
  template: null, 
  /** @type {Underscore.template} */
  compiledTemplate: null,

  initialize: function() {
    if(!this.template) { 
      CommentView.prototype.template = $.get('/components/comment/comment.tpl');
    }
    var user = this.model.get('user');
    user = user.toLowerCase();
    this.model.set('user', user);
  },

  render: function() {
    // Done means that function will be run when template is loaded.
    this.template.done(_.bind(this.onTemplateLoaded, this));

    return this;
  },

  onTemplateLoaded: function(tpl) {
	// Cache compiled template.
    if (!this.compiledTemplate) {
      CommentView.prototype.compiledTemplate = _.template(tpl);
    }
    this.$el.html(this.compiledTemplate(this.model.toJSON()));
  }
});

/** Comment creation form. */
var CommentForm = Backbone.View.extend({
  /** @type {jQuery.promise} */
  template: null, 

  events: {
    'click .addCommentButton': 'addNew'
  },

  initialize: function() {
    if(!this.template) { 
      CommentForm.prototype.template = $.get('/components/comment/comment-form.tpl');
    }
  },

  addNew: function() {
    ga.trackComment(this.model.get('memeId'));
    var text = $('.addCommentTextArea', this.$el).val();
    this.model.save('text', text, {success: _.bind(function(model) {
      this.options.list.add(model);
    }, this)});
  },

  render: function() {
    // Done means that function will be runned when template is loaded.
    this.template.done(_.bind(function(tpl) {
      this.$el.append(tpl);
    }, this));

    return this;
  }
});

/** List of comments view. */
var CommentsView = Backbone.View.extend({
  tagName: 'div',
  className: 'comments',

  initialize: function() {
    this.model.on('add', this.render, this);
  },

  render: function() {
    this.$el.empty();

    // Render list of comments.
    _.each(this.model.models, _.bind(function(model){
      var commentView = new CommentView({model: model});
      this.$el.append(commentView.render().$el);
    }, this));

    // Render comment creation form.
    var commentForm = new CommentForm({
      model: new Comment({memeId: this.model.memeId}),
      list: this.model
    });
    this.$el.append(commentForm.render().$el);

    return this;
  }
});
