class Api::V1::RunesController < ApplicationController
  def index
    @data ||= File.read("app/fixtures/runes.json")
    render :json => @data
  end
end
