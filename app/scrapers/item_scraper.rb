require 'mixins/arreat_scraper'
include ArreatScraper

#xxx: refactor to not repeat scrapes
page_category_mappings = {
  "Body Armor" => [
    { "page" => "armor" },
  ],
  "Helms" => [
    { "page" => "helms" },
    { "page" => "barbhelms", "class_specific" => "Barbarian" },
    { "page" => "druidpelts", "class_specific" => "Druid" },
  ],
  "Shields" => [
    { "page" => "shields" },
    { "page" => "paladinshields", "class_specific" => "Paladin" },
    { "page" => "shrunkenheads", "class_specific" => "Necromancer" },
  ],
  "Axes" => [
    { "page" => "axes" },
  ],
  "Scepters" => [
    { "page" => "scepters" },
  ],
  "Maces" => [
    { "page" => "maces" },
  ],
  "Missile Weapons" => [
    { "page" => "bows" },
    { "page" => "crossbows" },
  ],
  "Weapons" => [
    { "page" => "axes" },
    { "page" => "bows" },
    { "page" => "crossbows" },
    { "page" => "daggers" },
    { "page" => "javelins" },
    { "page" => "maces" },
    { "page" => "polearms" },
    { "page" => "scepters" },
    { "page" => "spears" },
    { "page" => "staves" },
    { "page" => "swords" },
    { "page" => "wands" },
    { "page" => "amazonweapons", "class_specific" => "Amazon" },
    { "page" => "katars", "class_specific" => "Assassin" },
    { "page" => "orbs", "class_specific" => "Sorceress" },
  ],
  "Claws" => [
    { "page" => "katars", "class_specific" => "Assassin" },
  ],
  "Swords" => [
    { "page" => "swords" },
  ],
  "Polearms" => [
    { "page" => "polearms" },
  ],
  "Melee Weapons" => [
    { "page" => "axes" },
    { "page" => "daggers" },
    { "page" => "javelins" },
    { "page" => "maces" },
    { "page" => "polearms" },
    { "page" => "scepters" },
    { "page" => "spears" },
    { "page" => "staves" },
    { "page" => "swords" },
    { "page" => "wands" },
    { "page" => "amazonweapons", "class_specific" => "Amazon" },
    { "page" => "katars", "class_specific" => "Assassin" },
  ],
  "Paladin Shields" => [
    { "page" => "paladinshields", "class_specific" => "Paladin" },
  ],
  "Staves" => [
    { "page" => "staves" },
  ],
  "Wand" => [
    { "page" => "wands" },
  ],
}

items_response = {}
items = []

page_category_mappings.each do |runeword_type, page_names|
  items_response[runeword_type] = {}
  ["normal", "exceptional", "elite"].each do |quality|
    items_response[runeword_type][quality] = {
      "properties" => [],
      "items" => []
    }
    page_names.each do |page_name|
      print "."
      doc = Nokogiri::HTML(open("#{ArreatScraper::ARREAT_SUMMIT_DOMAIN}/diablo2exp/items/#{quality}/#{page_name["page"]}.shtml"))

      item_tables = doc.xpath('//table[@cellpadding=5]')
      items_by_quality = []

      item_tables.each do |item_table|
        item_property_keys = ["img_url"]
        #XXX: refactor to always use label mappings
        item_property_label_mappings = [
          {
            "key" => "img_url",
            "label" => "Image"
          }
        ]
        ArreatScraper::parse_item_table(
          item_table, item_property_keys, items_by_quality,
          item_property_label_mappings, page_name["class_specific"]
        )
        items_response[runeword_type][quality]["properties"] += item_property_label_mappings
      end

      items_response[runeword_type][quality]["items"] += items_by_quality
    end

    items_response[runeword_type][quality]["properties"].uniq!
  end
end

mace_group_mappings = {
  "Clubs" => {
    "normal" => ["Club", "Spiked Club"],
    "exceptional" => ["Cudgel", "Barbed Club"],
    "elite" => ["Truncheon", "Tyrant Club"],
  },
  "Maces" => {
    "normal" => ["Mace", "Morning Star", "Flail"],
    "exceptional" => ["Flanged Mace", "Jagged Star", "Knout"],
    "elite" => ["Reinforced Mace", "Devil Star", "Scourge"],
  },
  "Hammers" => {
    "normal" => ["War Hammer", "Maul", "Great Maul"],
    "exceptional" => ["Battle Hammer", "War Club", "Martel de Fer"],
    "elite" => ["Legendary Mallet", "Ogre Maul", "Thunder Maul"],
  }
}

mace_group = items_response.delete("Maces")
mace_group_mappings.each do |runeword_type, mace_mappings|
  items_response[runeword_type] = {}
  mace_mappings.each do |quality, item_names|
    items_response[runeword_type][quality] = {
      "properties" => mace_group[quality]["properties"],
      "items" => []
    }

    item_names.each do |item_name|
      matched_item = mace_group[quality]["items"].detect{ |scraped_item| scraped_item["name"] == item_name }
      items_response[runeword_type][quality]["items"] << matched_item
    end
  end
end

print "Done.\n"

ArreatScraper::json_to_file("items", items_response)
