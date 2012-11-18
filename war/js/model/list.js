var memes = new Memes();

memes.fetch({success: function() {
  for (var i = 0; i < memes.length; i++) {
    var memeView = new MemeView({model: memes.at(i)});
    $('#main_area').append(memeView.render().$el);
  }
}});
