var meme = new Meme({id: 1});

meme.fetch({success: function() {
  var memeView = new MemeView({model: meme});
  $('#main_area').append(memeView.render().$el);
}});