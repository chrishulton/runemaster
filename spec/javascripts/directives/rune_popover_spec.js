/* global expect */
/* global inject */
/* global spyOn */
"use strict";

describe('runePopover', function() {
  var $compile, $rootScope, $scope;
  var element, compiledRuneRecipe;

  var elementHtml = "<rune-popover rune='rune' recipe='recipe'></rune-popover>";
  var runeRecipeHtml = "<rune-recipe recipe='recipe'></rune-recipe>";

  beforeEach(function() {
    module("runemaster");

    inject(function(_$compile_, _$rootScope_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;
    });

    $scope = $rootScope.$new();
    $scope.rune = { name: 'Eld' };

    spyOn($.fn, 'popover');

    compiledRuneRecipe = $compile(runeRecipeHtml)($scope);
    element = $compile(elementHtml)($scope);
    $rootScope.$apply();
  });

  describe('when the recipe exists', function() {
    beforeEach(function() {
      $scope.recipe = [
        {
          name: 'El',
          quantity: '3',
          type: 'rune',
        }
      ];

      compiledRuneRecipe = $compile(runeRecipeHtml)($scope);
      element = $compile(elementHtml)($scope);
      $rootScope.$apply();
    });

    it('triggers the popover with the correct params', function() {
      expect($.fn.popover).toHaveBeenCalledWith({
        trigger: 'hover',
        html: true,
        content: compiledRuneRecipe,
        placement: 'right'
      });
    });
  });

  describe('when the recipe does not exist', function() {
    beforeEach(function() {
      compiledRuneRecipe = $compile(runeRecipeHtml)($scope);
      element = $compile(elementHtml)($scope);
      $rootScope.$apply();
    });

    it('does not trigger the popover', function() {
      expect($.fn.popover).not.toHaveBeenCalled();
    });
  });
});
