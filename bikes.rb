require 'sinatra'
require 'httparty'

def request_station_data
  response = HTTParty.get("http://www.citibikenyc.com/stations/json")
  puts response.code
  response.body
end

get "/bikes" do
  erb :bikes
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
  #return hsh.to_json
  return request_station_data
end

request_station_data
