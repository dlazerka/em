// jauhen@

var Meme = Backbone.Model.extend({
  defaults: {
    id: 0,
    blobKey: null,
    src: '',
    date: (new Date),
    template: 'template1',
    messages: [{text: '', css: 'top-center'}],
    font: 'Impact'
  },
  urlRoot: '/meme'
});

var Memes = Backbone.Collection.extend({
  model: Meme,
  url: '/memes'
});

var MemeView = Backbone.View.extend({
  tagName: 'div',
  className: 'meme',
  fontSize: 30,

  template: function(obj) {
    var output = '';

    _.each(obj.messages, function(message) {
      var longCss = message.text.length > 15 ? ' long' : ''; 
      output += '<div class="message ' + message.css + longCss + '">' + message.text + '</div>';
    });

    output += '<img src="' + obj.src + '" alt="' + obj.text + '" title="' + obj.text + '"/>';

    return output;
  },

  initialize: function () {
    this.render();
  },

  events: {
    'click' : 'onclick' 
  },

  onclick: function(event) {
    if (!Upload.onMemeClick(event, this)) {
      Backbone.history.navigate('#meme/' + this.model.get('id'), true);
    }
  },

  render: function(fontSize) {
    this.$el.html(
      this.template({
        src: this.model.get('src'),
        text: _.map(this.model.get('messages'), function (el) {return el.text}).join(' '),
        messages: this.model.get('messages')
      }));

    var element = this.$el;
    fontSize = fontSize || this.fontSize;
    $(element).hide();
    $('img', element).load(function() {
      $(element).show();
      $('div', element).map(function() {
        var parentWidth = $(element).width();
        $(this).css('display', 'block');
        var width = $(this).width();
        if (parentWidth < width) {
          $(this).css('font-size', Math.floor(fontSize * (parentWidth - 20) / width));
        }
        $(this).width(parentWidth);
      });
    });

    return this;
  },
});