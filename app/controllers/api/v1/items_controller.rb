class Api::V1::ItemsController < ApplicationController
  def index
    @data ||= File.read("app/fixtures/items.json")
    render :json => @data
  end
end
