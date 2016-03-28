// @ngInject
function RuneWords($resource) {
  "use strict";

  return $resource('/api/v1/rune_words', {}, {
    index: { method: 'GET', isArray: true}
  });
}

angular.module('runemaster').factory('RuneWords', RuneWords);
