describe('Memes specifications', function() {

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
});
