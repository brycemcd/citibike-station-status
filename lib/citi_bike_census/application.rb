require 'json'

module CitiBikeCensus
  class Application < Sinatra::Base
    set :root, "#{File.dirname(__FILE__)}/../../"
    set :views, Proc.new { File.join(root, "views") }

    configure do
      enable :logging, :show_exceptions
    end

    get "/bikes" do
      erb :bikes
    end

    post "/collect_location.json" do
      content_type :json
      puts params.to_json
      STDOUT.flush
      return {status: :ok}.to_json
    end

    get "/bike_info.json" do
      response['Access-Control-Allow-Origin'] = "*"
      null = nil
      hsh = {"executionTime"=> "2014-09-14 11:43:01 AM",
             "stationBeanList"=> [
               {
                 "id"=> 72,
                 "stationName"=> "W 52 St & 11 Ave",
                 "availableDocks"=> rand(100),
                 "totalDocks"=> rand(100),
                 "latitude"=> 40.76727216,
                 "longitude"=> -73.99392888,
                 "statusValue"=> "In Service",
                 "statusKey"=> 1,
                 "availableBikes"=> rand(100),
                 "stAddress1"=> "W 52 St & 11 Ave",
                 "stAddress2"=> "",
                 "city"=> "",
                 "postalCode"=> "",
                 "location"=> "",
                 "altitude"=> "",
                 "testStation"=> false,
                 "lastCommunicationTime"=> null,
                 "landMark"=> ""
               },
               {
                 "id"=> 79,
                 "stationName"=> "test2",
                 "availableDocks"=> rand(100),
                 "totalDocks"=> 37,
                 "latitude"=> 40.76727216,
                 "longitude"=> -73.99392888,
                 "statusValue"=> "In Service",
                 "statusKey"=> 1,
                 "availableBikes"=> rand(100),
                 "stAddress1"=> "W 52 St & 11 Ave",
                 "stAddress2"=> "",
                 "city"=> "",
                 "postalCode"=> "",
                 "location"=> "",
                 "altitude"=> "",
                 "testStation"=> false,
                 "lastCommunicationTime"=> null,
                 "landMark"=> ""
               },
               {
                 "id"=> 82,
                 "stationName"=> "test3",
                 "availableDocks"=> rand(100),
                 "totalDocks"=> 37,
                 "latitude"=> 40.76727216,
                 "longitude"=> -73.99392888,
                 "statusValue"=> "In Service",
                 "statusKey"=> 1,
                 "availableBikes"=> rand(100),
                 "stAddress1"=> "W 52 St & 11 Ave",
                 "stAddress2"=> "",
                 "city"=> "",
                 "postalCode"=> "",
                 "location"=> "",
                 "altitude"=> "",
                 "testStation"=> false,
                 "lastCommunicationTime"=> null,
                 "landMark"=> ""
               }]}
      response = HTTParty.get("http://www.citibikenyc.com/stations/json")
      return response.body
    end
  end
end
