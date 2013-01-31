describe('MemeView', function() {
  var view;
  var model;
  var container;
  var tpl = '<div><img class="img" src="<%=image.src%>" title="<%-image.text%>"/>' +
      '<% _.each(messages, function(msg) { %>' +
      '<div class="message <%=msg.where%>-center"><%=msg.lines%>' +
      '</div><% }); %></div>';

  beforeEach(function() {

    jasmine.Ajax.useMock();
    model = new Meme({
      id: 1,
      blobKey: '123',
      src: 'http://example.com/1.jpg',
      top: 'top1 very long very long longer than ever message',
      bottom: 'bottom3',
      rating: 4,
      width: 100,
      height: 150
    });
    container = $('<div></div>');
  });

  it('render', function() {
    view = new MemeView({model: model});

    container.append(view.render().$el);

    // TODO:jauhen@gmail.com Extend this test.
    expect(container.children('.meme').children().size()).toBe(2);
  });
});
