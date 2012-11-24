var Create = {};

$(function() {
  $('#topText,#centerText,#bottomText').keyup(Create.updateTexts);
  $('#preview2').html(Create.memeView.render(50).$el);
});

Create.meme = new Meme();
Create.memeView = new MemeView({model: Create.meme, className: 'memePreview'});

Create.updateTexts = function() {
  Create.meme.set('messages', [{text: 'sdfgdf', css: 'top-center'}]);
  $('#preview2').html(Create.memeView.render(50).$el);
  var topText = $('#topText').val();
}

Create.setPreview = function(src, blobKey) {
  Create.meme.set('src', src);
  Create.meme.set('blobKey', blobKey);
  $('#preview2').html(Create.memeView.render(50).$el);
}