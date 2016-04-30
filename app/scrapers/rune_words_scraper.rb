require 'mixins/arreat_scraper'
include ArreatScraper

RUNE_WORD_KEYS = ["name", "allowed_items", "rune_order", "completed_stats", "ladder_only"]

def self.parse_rune_table(rune_words_table, rune_words, ladder_only)
  rune_words_table.xpath('tr').each_with_index do |row,index|
    if index > 0
      rune_word_values = []
      row.xpath('.//span').each do |property|
        content = property.content
        # runes
        if match = content.match(/ \+ /)
          content = content.squish
          rune_word_values << content.split(match[0])
        # item types
        elsif match = content.match(/(\d) Socket (.*)/)
          item_types = []
          match[2].split(/\//).each do |content_item|
            content_item.sub!(/(\*)* \(.*\)/, "")
            if content_item.present?
              item_types << {
                "sockets" => match[1],
                "type" => content_item.gsub(/[\* ]$/,'')
              }
            end
          end
          rune_word_values << item_types
        # stats
        elsif content.match(/\n/)
          item_types = property.xpath('.//b').map { |type| type.content }
          content_lines = content.split(/\n/).map { |item| item.squish }
          if item_types.present?
            item_type_stats = []
            item_types.each_with_index do |type, index|
              item_stats = []
              first_index = content_lines.index(type) + 1
              last_index = begin
                if index == item_types.length - 1
                  content_lines.length
                else
                  content_lines.index(item_types[index + 1])
                end
              end
              item_type_properties = content_lines.slice(first_index, last_index - first_index)
              item_stats = item_type_properties.select { |line| line.present? }

              item_type_stats << { :key => type, :stats => item_stats}
            end
            rune_word_values << item_type_stats
          # name
          else 
            rune_word_values << [
              { :key => :default, :stats => content_lines.select { |line| line.present? } }
            ]
          end
        else
          rune_word_values << content.squish.gsub(/\*/,'')
        end
      end

      result = {}
      rune_word_values.each_with_index do |property,index|
        result[RUNE_WORD_KEYS[index]] = property
      end
      unless result.empty?
        result[:ladder_only] = ladder_only
        rune_words << result
      end
    end
  end
end

rune_words_list = []

["runewords-original", "runewords-110", "runewords-111"].each do |page|
  rune_words_doc = Nokogiri::HTML(open("#{ArreatScraper::ARREAT_SUMMIT_DOMAIN}/diablo2exp/items/#{page}.shtml"))
  rune_words_doc.xpath("//table[@cellpadding=5]").each_with_index do |rune_word_table, index|
    if rune_word_table.xpath(".//th//span[contains(text(), 'Ladder Rune Words')]").present?
      self.parse_rune_table(rune_word_table, rune_words_list, true)
    elsif rune_word_table.xpath(".//th//span[contains(text(), 'Rune Words')]").present?
      self.parse_rune_table(rune_word_table, rune_words_list, false)
    end
  end
end

ArreatScraper::json_to_file("rune_words", rune_words_list)
