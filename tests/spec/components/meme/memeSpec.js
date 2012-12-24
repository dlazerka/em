describe('Meme specifications', function() {

  describe('for model:', function() {

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

  describe('for collection:', function() {
    var memes;

    beforeEach(function() {
      memes = new Memes([
        {
          "id": 484,
          "blobKey": "mlIzCkBq307w4pKda81tOQ",
          "src": "/image/meme484?blobKey=mlIzCkBq307w4pKda81tOQ",
          "animated": true,
          "height": 129,
          "width": 158,
          "timestamp": 1356347895496,
          "top": "No",
          "rating": 1
        },
        {
          "id": 482,
          "blobKey": "ZC2PkVlTYfP4QZg5LCDPuA",
          "src": "/image/meme482?blobKey=ZC2PkVlTYfP4QZg5LCDPuA",
          "animated": false,
          "height": 526,
          "width": 464,
          "timestamp": 1356347867283,
          "top": "Hello",
          "rating": 0
        }]);
    });

    it('setFilter should reset pagination', function() {
      memes.page = 2;
      memes.setFilter('all');
      expect(memes.page).toBe(0);
    });

    it('fetch params should return page and filter', function() {
      expect(memes.getParams()).toEqual({
        page: 0,
        filter: 'popular'
      });
    });
  });

  // TODO:jauhen Add tests for view.
  describe('for view:', function() {
    var view;

    beforeEach(function() {
      var model = new Meme({
        id: 1,
        blobKey: '123',
        src: 'http://expamle.com/1.jpg',
        top: 'top1',
        bottom: 'bottom3',
        rating: 4
      });

      view = new MemeView({model: model});


    });

    it('render', function() {
      var container = $('div');

      container.append(view.render().$el);
    });

  });
});
