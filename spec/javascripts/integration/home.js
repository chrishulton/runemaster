/* global browser */
/* global by */
/* global element */
/* global expect */
"use strict";

describe('runemaster home', function() {
  beforeEach(function() {
    browser.get("/");
    browser.waitForAngular();
  });

  describe('runes table', function() {
    it('renders each rune', function() {
      expect(
        element.all(by.css('.runeList tr')).count()
      ).toEqual(34);
    });

    describe('rune content', function() {
      var eldRune = element(by.css('.runeList tbody tr:nth-child(2)'));

      it('renders the rune name and img', function() {
        var runeCell = eldRune.element(by.css('.runeList-rune'));

        expect(
          runeCell.element(by.css('span')).getText()
        ).toEqual('Eld');

        expect(
          runeCell.element(by.css('img'))
          .getAttribute('src')
        ).toEqual('http://classic.battle.net//images/battle/diablo2exp/images/runes/runeEld.gif');
      });

      it('renders the rune odds', function() {
        expect(
          eldRune.element(by.css('.runeList-odds')).getText()
        ).toEqual('1:2302');
      });

      it('renders the rune recipe', function() {
        var recipeCell = eldRune.element(by.css('.runeList-recipe'));

        expect(
          recipeCell.element(by.css('.recipe-part-quantity')).getText()
        ).toEqual('3 x');

        expect(
          recipeCell.element(by.css('.recipe-part-name')).getText()
        ).toEqual('El');

        expect(
          recipeCell.element(by.css('.recipe-part-img'))
          .getAttribute('src')
        ).toEqual('http://classic.battle.net//images/battle/diablo2exp/images/runes/runeEl.gif');
      });
    });
  });

  describe('rune words table', function() {
    it('renders each rune word', function() {
      expect(
        element.all(by.css('.runeWordList tr')).count()
      ).toEqual(79);
    });

    describe('rune word content', function() {
      var apRuneWord = element(by.css('.runeWordList tbody tr:nth-child(1)'));

      it('renders the rune word name', function() {
        expect(
          apRuneWord.element(by.css('td:nth-child(1)')).getText()
        ).toEqual("Ancient's Pledge");
      });

      it('renders the rune word name', function() {
        expect(
          apRuneWord.element(by.css('td:nth-child(2)')).getText()
        ).toEqual("3 Socket Shields");
      });

      describe('rune order', function() {
        var runeOrderCell = apRuneWord.element(by.css('td:nth-child(3)'));

        it('renders the runes in order', function() {
          runeOrderCell.all(by.css('li')).then(function(apRunes) {
            ['Ral', 'Ort', 'Tal'].forEach(function(rune, runeIndex) {
              expect(apRunes[runeIndex].getText()).toEqual(rune);
            });
          });
        });

        it('renders the rune progress bar', function() {
          var runeProgressBar = runeOrderCell.element(by.css('.progress-bar'));

          expect(runeProgressBar.getAttribute('aria-valuenow')).toEqual('0');
          expect(runeProgressBar.getAttribute('aria-valuemin')).toEqual('0');
          expect(runeProgressBar.getAttribute('aria-valuemax')).toEqual('3');
        });
      });

      describe('completed stats', function() {
        var statsCell = apRuneWord.element(by.css('td:nth-child(4)'));

        it('renders each stat', function() {
          expect(
            statsCell.all(by.css('li')).count()
          ).toEqual(6);
        });

        it('renders the stat data', function() {
          expect(
            statsCell.element(by.css('li:nth-child(1)')).getText()
          ).toEqual('+50% Enhanced Defense');
        });
      });
    });
  });
});