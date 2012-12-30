describe('Meme specifications', function() {
  var model;

  beforeEach(function() {
    model = new Meme({
      id: 1,
      blobKey: '123',
      src: 'http://expamle.com/1.jpg',
      top: 'top1',
      bottom: 'bottom3',
      rating: 4
    });
  });

  it('on meme model creating vote should be created', function() {
    expect(model.vote).toBeDefined();
    expect(model.vote.get('id')).toBe(1);
    expect(model.vote.get('rating')).toBe(4);
  });

  it('on vote rating change meme model should be updated', function() {
    model.vote.set({rating: 5});
    expect(model.get('rating')).toBe(5);
  });

  it('message map return only messages', function(){
    expect(model.getMessagesMap()).toEqual({
      top: 'top1',
      center: null,
      bottom: 'bottom3'
    });
  });

  it('validate should check blobKey', function() {
    var errorCallback = jasmine.createSpy('-error event callback-');

    model.on('error', errorCallback);
    model.set({blobKey: null});

    var errorArgs = errorCallback.mostRecentCall.args;
    expect(errorArgs).toBeDefined();
    expect(errorArgs[0]).toBe(model);
    expect(errorArgs[1]).toBe('No image');
  });
});
