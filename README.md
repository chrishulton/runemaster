# runemaster
For players of the classic [Diablo II](http://us.blizzard.com/en-us/games/d2/), get all your rune words, allowed items, and rune upgrade formulas in one place with [runemaster](http://runemaster.herokuapp.com).

All images and data c/o the [Arreat Summit](http://classic.battle.net/diablo2exp/).

Features include
* Ability to track progress toward rune words, persisting between sessions
* Detailed item overlay to show potential items for each runeword, separated by quality
* Ability to search and filter rune words by various options including item type and progress
* Rune odds and upgrade formulas for each rune

![](http://c1.staticflickr.com/2/1672/26464422240_45106f6304_k.jpg "Main View")

![](http://c3.staticflickr.com/2/1583/26643791682_b2272b3a34_k.jpg "Item Modal")

# How it works
* Scrapers run against various Arreat Summit pages, extracting relevant information and aggregating the data into JSON fixture files
* The backend serves these JSON files via the /api/v1 namespace
* The angular frontend requests this data via ajax and displays the results in tabular form, with additional UI functionality provided by bootstrap
* User data for the number of runes owned is persisted between sessions via browser local storage
