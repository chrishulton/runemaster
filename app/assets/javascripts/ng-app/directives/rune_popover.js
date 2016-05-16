// @ngInject
// XXX: this directive exists because uib-popover does not allow
// passing in a directive, only static html or a separate template
function runePopover($compile) {
  return {
    restrict: 'E',
    scope: {
      rune:'=',
      recipe:'='
    },
    template: '<span>{{rune}}</span>',
    link: function (scope, el, attrs) {
      var runeRecipeHtml = "<rune-recipe rune='rune' recipe='recipe'></rune-recipe>";
      var compiledRuneRecipe = $compile(runeRecipeHtml)(scope);

      $(el).popover({
        trigger: 'hover',
        html: true,
        content: compiledRuneRecipe,
        placement: 'right'
      });
    }
  }
};

angular.module('runemaster').directive('runePopover', runePopover);
