/* global expect */
/* global inject */
/* global spyOn */
"use strict";

describe('runeRecipe', function() {
  var $compile, $rootScope, $scope, ImgUrls;
  var element;

  var elementHtml = "<rune-recipe recipe='recipe'></rune-recipe>";
  var fakeImgMapping = {
    'El': 'rune.jpg',
    'Diamond': 'diamond.jpg'
  };

  beforeEach(function() {
    module("runemaster");

    inject(function(_$compile_, _$rootScope_, _ImgUrls_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;
      ImgUrls = _ImgUrls_;
    });

    spyOn(ImgUrls, 'getImgUrl').and.callFake(function(name) {
      return fakeImgMapping[name];
    });
  });

  describe('rendering recipe data', function() {
    beforeEach(function() {
      $scope = $rootScope.$new();
      $scope.recipe = [
        {
          name: 'El',
          quantity: '3',
          type: 'rune',
        },
        {
          name: 'Diamond',
          quantity: '1',
          type: 'gem',
        },
      ];

      element = $compile(elementHtml)($scope);
      $rootScope.$apply();
    });

    describe('rendering rune data', function() {
      it('renders the from rune quantity', function() {
        expect(
          element.find(".recipe-part--rune .recipe-part-quantity").html()
        ).toContain("3 x");
      });

      it('renders the from rune name', function() {
        expect(
          element.find(".recipe-part--rune .recipe-part-name").html()
        ).toContain("El");
      });

      it('renders the from rune image', function() {
        expect(
          element.find(".recipe-part--rune .recipe-part-img").attr('src')
        ).toEqual(fakeImgMapping.El);
      });
    });

    describe('rendering gem data', function() {
      it('renders the from gem quantity', function() {
        expect(
          element.find(".recipe-part--gem .recipe-part-quantity").length
        ).toEqual(0);
      });

      it('renders the from gem name', function() {
        expect(
          element.find(".recipe-part--gem .recipe-part-name").html()
        ).toContain("Diamond");
      });

      it('renders the from gem image', function() {
        expect(
          element.find(".recipe-part--gem .recipe-part-img").attr('src')
        ).toEqual(fakeImgMapping.Diamond);
      });
    });

    it('renders one recipe join symbol', function() {
      expect(
        element.find(".recipe-fromItemJoin").length
      ).toEqual(1);
    });
  });
});
