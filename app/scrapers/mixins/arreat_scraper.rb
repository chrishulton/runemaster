require 'nokogiri'
require 'open-uri'
require 'multi_json'

module ArreatScraper
  ARREAT_SUMMIT_DOMAIN = "http://classic.battle.net/"

  def self.parse_item_table(table, property_keys, results)
    table.xpath('tr').each_with_index do |row,index|
      if index == 0
        row.xpath('.//span').each do |property|
          property_keys << property.content.downcase.gsub(/\//,'-')
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
