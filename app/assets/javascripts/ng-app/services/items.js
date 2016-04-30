// @ngInject
function Items($resource) {
  "use strict";

  return $resource('/api/v1/items', {}, {
    get: { method: 'GET', cache: true }
  });
}

angular.module('runemaster').factory('Items', Items);
