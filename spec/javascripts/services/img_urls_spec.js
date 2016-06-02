/* global expect */
/* global inject */
"use strict";

describe('ImgUrls', function() {
  var ImgUrls;

  beforeEach(function() {
    module("runemaster");

    inject(function(_ImgUrls_) {
      ImgUrls = _ImgUrls_;
    });
  });

  it('maintains the img url map', function() {
    var fakeKey = "key";
    var fakeImgUrl = "rune.jpg";

    expect(ImgUrls.getImgUrl(fakeKey)).toBeUndefined();

    ImgUrls.addImgUrl(fakeKey, fakeImgUrl);

    expect(ImgUrls.getImgUrl(fakeKey)).toEqual(fakeImgUrl);
  });
});
