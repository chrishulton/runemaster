// @ngInject
function ImgUrls() {
  "use strict";

  var imgUrls= {};

  return {
    addImgUrl: function(key, url) {
      imgUrls[key] = url;
    },
    getImgUrl: function(key) {
      return imgUrls[key];
    }
  };
}

angular.module('runemaster').factory('ImgUrls', ImgUrls);
