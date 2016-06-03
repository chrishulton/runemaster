/* global browser */
/* global by */
/* global element */
/* global expect */
"use strict";

describe('user views items modal', function() {
  beforeEach(function() {
    browser.get("/");
    browser.waitForAngular();
  });

  var itemsModal = element(by.css('.itemsModal'));
  var itemsModalTable = itemsModal.element(by.css('table'));
  var apRuneWord = element(by.css('.runeWordList tbody tr:nth-child(1)'));

  it("launches the item modal and shows the elite items", function() {
    apRuneWord.element(by.css('td:nth-child(2) li:nth-child(1) > a')).click().then(function() {
      expect(
        itemsModal.element(by.css('.modal-title')).getText()
      ).toEqual("3 Socket Shields");

      var selectedQuality = itemsModal.element(by.css('.itemsModal-heading-quality.is-selected'));
      expect(selectedQuality.getText()).toEqual("Elite");

      var eliteItems = itemsModalTable.all(by.css('tbody tr'));

      expect(eliteItems.count()).toEqual(11);
      expect(itemsModalTable.all(by.css('thead th')).count()).toEqual(11);

      expect(eliteItems.first().element(by.css('td:nth-child(2)')).getText()).toEqual('Hyperion');
      expect(eliteItems.first().element(by.css('td:nth-child(1)')).getText()).toEqual('');
      expect(eliteItems.last().element(by.css('td:nth-child(2)')).getText()).toEqual('Vortex Shield');
      expect(eliteItems.last().element(by.css('td:nth-child(1)')).getText()).toEqual('PALADIN ONLY');

      itemsModal.element(by.css('.modal-dismiss')).click().then(function() {
        expect(
          element(by.css('.itemsModal')).isPresent()
        ).toEqual(false);
      });
    });
  });

  it("allows filtering by exceptional items", function() {
    apRuneWord.element(by.css('td:nth-child(2) li:nth-child(1) > a')).click().then(function() {
      var exceptionalHeader = itemsModal.element(by.css('.itemsModal-heading-quality:nth-child(2)'));
      exceptionalHeader.click().then(function() {
        expect(
          exceptionalHeader.getAttribute('class')
        ).toEqual('itemsModal-heading-quality is-selected');

        var exceptionalItems = itemsModalTable.all(by.css('tbody tr'));

        expect(exceptionalItems.count()).toEqual(9);

        expect(exceptionalItems.first().element(by.css('td:nth-child(2)')).getText()).toEqual('Scutum');
        expect(exceptionalItems.first().element(by.css('td:nth-child(1)')).getText()).toEqual('');
        expect(exceptionalItems.last().element(by.css('td:nth-child(2)')).getText()).toEqual('Royal Shield');
        expect(exceptionalItems.last().element(by.css('td:nth-child(1)')).getText()).toEqual('PALADIN ONLY');
      });
    });
  });

  it("allows filtering by normal items", function() {
    apRuneWord.element(by.css('td:nth-child(2) li:nth-child(1) > a')).click().then(function() {
      var normalHeader = itemsModal.element(by.css('.itemsModal-heading-quality:nth-child(1)'));
      normalHeader.click().then(function() {
        expect(
          normalHeader.getAttribute('class')
        ).toEqual('itemsModal-heading-quality is-selected');

        var normalItems = itemsModalTable.all(by.css('tbody tr'));
        expect(normalItems.count()).toEqual(9);

        expect(normalItems.first().element(by.css('td:nth-child(2)')).getText()).toEqual('Large Shield');
        expect(normalItems.first().element(by.css('td:nth-child(1)')).getText()).toEqual('');
        expect(normalItems.last().element(by.css('td:nth-child(2)')).getText()).toEqual('Crown Shield');
        expect(normalItems.last().element(by.css('td:nth-child(1)')).getText()).toEqual('PALADIN ONLY');
      });
    });
  });

  it("shows the zero state only when no items match", function() {
    var clubRuneWord = element(by.css('.runeWordList tbody tr:nth-child(3)'));
    clubRuneWord.element(by.css('td:nth-child(2) li:nth-child(1) > a')).click().then(function() {
      itemsModal.element(by.css('.itemsModal-heading-quality:nth-child(1)')).click().then(function() {
        expect(
          element(by.css('.itemsModal-items tbody .zeroState')).isDisplayed()
        ).toBe(true);
      });
    });
  });
});
