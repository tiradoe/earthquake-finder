"use strict";
$(document).ready(function(){

    function initialize() {
        //Start with world map
        var mapOptions = {
          center: new google.maps.LatLng(0, 0),
          zoom: 2
        };
        var map = new google.maps.Map(document.getElementById("map-canvas"),
            mapOptions);
    }
 
    //Load the map on page load
    google.maps.event.addDomListener(window, 'load', initialize);

    var coordinates  = [];

    $('#search-field').on('submit', function(){
        getUpdatedMapInfo();
        return false;
    });


    function getMapFromGoogle(location){
        var key = "AIzaSyBBKz8YYLhryH5AISybvVh1EqC0u6HK6oU"
        var url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + location + 
		  "&sensor=true&key=" + key;

       return $.ajax({
            url: url,
            type: "get",
            dataType: 'json',
        });  
    }

    function getEarthquakes(north,south,east,west,range){
        var date = range == null ? '': '&date=' + range;
        var url = 'http://api.geonames.org/earthquakesJSON?north=' + north + 
		  '&south=' + south + 
		  '&east=' + east + 
		  '&west=' + west + 
		  date + 
		  '&username=tiradoe'

        return $.ajax({
            url: url,
            type: "get",
            dataType: 'json',
        }); 
    }

    function getUpdatedMapInfo(){
        var location = $('#location-field').val();
        var gdata = getMapFromGoogle(location);

        gdata.success(function(data){
            try{
                coordinates['lat'] = data.results[0].geometry.location.lat;
                coordinates['long'] = data.results[0].geometry.location.lng;
            } 
            catch(error){
                alert('Location not found.');
                return false;
            }

            updateDisplay(coordinates['lat'], coordinates['long']);
        });
    }

    function updateDisplay(lat,long){
        var map = new google.maps.Map(document.getElementById("map-canvas"),{
            center: new google.maps.LatLng(coordinates.lat,coordinates.long),
            zoom: 4
        });

        var northeast = map.getBounds().getNorthEast();
        var southwest = map.getBounds().getSouthWest();
       
        var north = northeast.lat();
        var south = southwest.lat();
        var east = northeast.lng();
        var west = southwest.lng();

        var qData = getEarthquakes(north,south,east,west);

        qData.success(function(data){
            var earthquakes = data.earthquakes;
            $.each(earthquakes,function(key,quake){
                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(quake.lat,quake.lng),
                    map: map,
                    title: "Magnitude: " + quake.magnitude
                });
            });
        });
    }

    //To Do: Get top 10 earthquakes for past year
    function getTop10(){
        var date = new Date();
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();

        var today = year + '-' + month + '-' + day;
        var qData = getEarthquakes(90,-90,180,-180,today);

        qData.success(function(data){
            var earthquakes = data.earthquakes;
            $.each(earthquakes,function(key,quake){
                //Get top 10 and list them
                //console.log(quake);
            });
        });
    }
});


    
