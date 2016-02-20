// @ngInject
function Runes($resource) {
  "use strict";

  return $resource('/api/v1/runes', {}, {
    index: { method: 'GET', isArray: true}
  });
}

angular.module('runemaster').factory('Runes', Runes);
