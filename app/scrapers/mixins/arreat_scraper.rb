require 'nokogiri'
require 'open-uri'
require 'multi_json'

module ArreatScraper
  ARREAT_SUMMIT_DOMAIN = "http://classic.battle.net/"

  def self.parse_item_table(table, property_keys, results, property_label_mappings = nil, class_specific = nil)
    table.xpath('tr').each_with_index do |row,index|
      if index == 0
        row.xpath('.//span').each do |property|
          if property.content == "\u00a0" || property.content.blank?
            property_keys << "name"
            if property_label_mappings
              property_label_mappings << {
                "key" => "name",
                "label" => "Name"
              }
            end
          #xxx: bucket required
          elsif property.content =~ /Level Require/
            property_keys << "level_required"
            if property_label_mappings
              property_label_mappings << {
                "key" => "level_required",
                "label" => "Level Required"
              }
            end
          #xxx: bucket hand req
          elsif property.content =~ /(.*)Handed (.*)|Daggers|Clubs|Maces|Hammers|Scepters|Wand/
            property_keys << "name"
            if property_label_mappings
              property_label_mappings << {
                "key" => "name",
                "label" => "Name"
              }
            end
          #xxx: bucket damage
          elsif property.content =~ /Two.{0,2}Hand Damage/
            property_keys << "min-max-2h-damage"
            if property_label_mappings
              property_label_mappings << {
                "key" => "min-max-2h-damage",
                "label" => "Min/Max 2h Damage"
              }
            end
          else
            property_key = property.content.downcase.gsub(/\/|( )+/,'-')
            if property_label_mappings
              property_label_mappings << {
                "key" => property_key,
                "label" => property.content
              }
            end
            property_keys << property_key
          end
        end
      else
        result_property_values = ["#{ARREAT_SUMMIT_DOMAIN}#{row.xpath('.//img')[0].attr('src')}"]

        row.xpath('.//span').each do |property|
          result_property_values << property.content.squish
        end

        result = {}
        result_property_values.each_with_index do |property,index|
          result[property_keys[index]] = property
        end

        result["class_specific"] = class_specific if class_specific

        results << result
      end
    end
  end

  def self.json_to_file(name, json)
    File.open("app/fixtures/#{name}.json", "w") do |f|
      f.write(MultiJson.dump(json))
    end
  end
end
