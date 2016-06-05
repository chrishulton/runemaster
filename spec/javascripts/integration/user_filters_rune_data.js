/* global browser */
/* global by */
/* global element */
/* global expect */
"use strict";

describe('user filters rune data', function() {
  beforeEach(function() {
    browser.get("/");
    browser.waitForAngular();
  });

  describe('filtering by ladder only', function() {
    it('includes ladder items when checked', function() {
      expect(
        element.all(by.css('.runeWordList tr')).count()
      ).toEqual(79);

      var sixthRw = element(by.css('.runeWordList tbody tr:nth-child(6)'));
      var sixthRwNameCell = sixthRw.element(by.css('td:nth-child(1)'));

      expect(
        sixthRwNameCell.getText()
      ).toEqual("Brand\nLADDER ONLY");
    });

    it('excludes ladder items when unchecked', function() {
      element(by.model('mainVm.includeLadderOnly')).click().then(function() {
          expect(
            element.all(by.css('.runeWordList tr')).count()
          ).toEqual(56);

          var sixthRw = element(by.css('.runeWordList tbody tr:nth-child(6)'));
          var sixthRwNameCell = sixthRw.element(by.css('td:nth-child(1)'));

          expect(
            sixthRwNameCell.getText()
          ).toEqual("Breath of the Dying");
      });
    });
  });

  describe('filtering by allowed items', function() {
    var allowedItemsMenu = element(by.model('mainVm.selectedItemType'));

    it('contains the allowable item types in the dropdown', function() {
      var allowedItemOptions = allowedItemsMenu.all(by.css('option'));

      expect(allowedItemOptions.count()).toEqual(18);
      expect(allowedItemOptions.first().getText()).toEqual("All");
      expect(allowedItemOptions.last().getText()).toEqual("Weapons");
    });

    it('filters by item type', function() {
      var wandOption = allowedItemsMenu.element(by.css('option:nth-child(17)'));
      expect(wandOption.getText()).toEqual("Wand");

      wandOption.click().then(function() {
        var filteredRuneWords = element.all(by.css('.runeWordList tbody tr'));

        expect(filteredRuneWords.count()).toEqual(1);

        expect(
          filteredRuneWords.first().element(by.css('td:nth-child(2)')).getText()
        ).toEqual("2 Socket Wand");
      });
    });
  });

  describe('filtering by rune', function() {
    var runesMenu = element(by.model('mainVm.selectedRune'));

    it('contains the runes in the dropdown', function() {
      var allowedRuneOptions = runesMenu.all(by.css('option'));

      expect(allowedRuneOptions.count()).toEqual(34);
      expect(allowedRuneOptions.first().getText()).toEqual("Any");
      expect(allowedRuneOptions.last().getText()).toEqual("Zod");
    });

    it('filters by rune', function() {
      var zodOption = runesMenu.element(by.css('option:nth-child(34)'));

      zodOption.click().then(function() {
        var filteredRuneWords = element.all(by.css('.runeWordList tbody tr'));

        expect(filteredRuneWords.count()).toEqual(1);

        expect(
          filteredRuneWords.first().element(by.css('td:nth-child(3)')).getText()
        ).toEqual("Vex\nHel\nEl\nEld\nZod\nEth");
      });
    });
  });

  describe('filtering by runes owned', function() {
    var runesNeededMenu = element(by.model('mainVm.selectedRunesNeeded'));

    it('contains the allowable rune numbers in the dropdown', function() {
      var runesNeededOptions = runesNeededMenu.all(by.css('option'));

      expect(runesNeededOptions.count()).toEqual(8);
      expect(runesNeededOptions.first().getText()).toEqual("Any");
      expect(runesNeededOptions.last().getText()).toEqual("6");
    });

    it('filters by runes needed', function() {
      var sixOption = runesNeededMenu.element(by.css('option:nth-child(8)'));
      expect(sixOption.getText()).toEqual("6");

      sixOption.click().then(function() {
        var filteredRuneWords = element.all(by.css('.runeWordList tbody tr'));

        expect(filteredRuneWords.count()).toEqual(3);

        expect(
          filteredRuneWords.first().element(by.css('td:nth-child(1)')).getText()
        ).toEqual("Breath of the Dying");

        var vexOwnedInput = element(by.name('runesOwned--Vex'));
        vexOwnedInput.sendKeys(1).then(function() {
          var filteredRuneWords = element.all(by.css('.runeWordList tbody tr'));

          expect(filteredRuneWords.count()).toEqual(1);

          expect(
            filteredRuneWords.first().element(by.css('td:nth-child(1)')).getText()
          ).toEqual("Last Wish\nLADDER ONLY");
        });
      });
    });
  });

  describe('filtering by search text', function() {
    var runeSearchInput = element(by.model('mainVm.runeWordNameSearchText'));

    it('filters by name match', function() {
      runeSearchInput.sendKeys("Brea").then(function() {
        var filteredRuneWords = element.all(by.css('.runeWordList tbody tr'));

        expect(filteredRuneWords.count()).toEqual(1);

        expect(
          filteredRuneWords.first().element(by.css('td:nth-child(1)')).getText()
        ).toEqual("Breath of the Dying");
      });
    });

  });

  describe('zero state', function() {
    it('hides the zero state by default', function() {
      expect(
        element(by.css('.runes-runeWords .zeroState')).isDisplayed()
      ).toBe(false);
    });

    it('displays zero state when nothing matches', function() {
      element(by.model('mainVm.runeWordNameSearchText')).sendKeys("zzzz").then(function() {
        var filteredRuneWords = element.all(by.css('.runeWordList tbody tr'));

        expect(filteredRuneWords.count()).toEqual(0);

        expect(
          element(by.css('.runes-runeWords .zeroState')).isDisplayed()
        ).toBe(true);
      });
    });
  });
});
