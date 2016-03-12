// @ngInject
function Gems($resource) {
  "use strict";

  return $resource('/api/v1/gems', {}, {
    index: { method: 'GET', isArray: true}
  });
}

angular.module('runemaster').factory('Gems', Gems);
