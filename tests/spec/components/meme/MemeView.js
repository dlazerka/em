describe('MemeView', function() {
  var view;
  var model;
  var container;
  var tpl = '<div>|<%=image.src%>|<%-image.text%>' +
      '<% _.each(messages, function(msg) { %>|<%=msg.lines%><% }); %>|</div>';

  beforeEach(function() {

    jasmine.Ajax.useMock();
    model = new Meme({
      id: 1,
      blobKey: '123',
      src: 'http://expamle.com/1.jpg',
      top: 'top1',
      bottom: 'bottom3',
      rating: 4
    });
    container = $('<div></div>');
  });

  it('render', function() {
    view = new MemeView({model: model});
    mostRecentAjaxRequest().response({status: 200, contentType: '*', responseText: tpl});

    container.append(view.render().$el);

    // TODO:jauhen@gmail.com Extend this test.
    expect(container.children('.meme').children().size()).toBe(2);

    view.positionMessages();
  });
});
