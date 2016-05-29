// @ngInject
function runeRecipe(ImgUrls) {
  "use strict";

  return {
    restrict: 'E',
    scope: {
      rune: '=',
      recipe: '='
    },
    templateUrl: '_rune_recipe.html',
    link: function(scope) {
      scope.itemImgUrl = ImgUrls.getImgUrl;
    }
  };
}

angular.module('runemaster').directive('runeRecipe', runeRecipe);
