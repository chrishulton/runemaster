// @ngInject
function RuneRecipes($resource) {
  "use strict";

  return $resource('/api/v1/rune_recipes');
}

angular.module('runemaster').factory('RuneRecipes', RuneRecipes);
