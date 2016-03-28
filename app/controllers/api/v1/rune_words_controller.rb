class Api::V1::RuneWordsController < ApplicationController
  def index
    @data ||= File.read("app/fixtures/rune_words.json")
    render :json => @data
  end
end
