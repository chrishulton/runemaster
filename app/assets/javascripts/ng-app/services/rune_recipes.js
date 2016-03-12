// @ngInject
function RuneRecipes($resource) {
  "use strict";

  return $resource('/api/v1/rune_recipes', {}, {
    index: { method: 'GET', isArray: true}
  });
}

angular.module('runemaster').factory('RuneRecipes', RuneRecipes);
