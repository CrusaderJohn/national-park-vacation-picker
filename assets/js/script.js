// Create a map and center it on Toronto.
var mapOptions = {
  zoom: 12,
  center: { lat: 43.65, lng: -79.35 },
};
var map = new google.maps.Map(document.getElementById(`map`), mapOptions);

// Instantiate a directions service.
var directionsService = new google.maps.DirectionsService();

// Create a renderer for directions and bind it to the map.
var rendererOptions = {
  map: map,
};
var directionsRenderer = new google.maps.DirectionsRenderer(rendererOptions);
directionsRenderer.setMap(map);

//add autoComplete for user
var option = {
  types: [`establishment`],
  componentRestrictions: { country: [`ca`] },
};

var input = document.getElementById(`origin`);
var autoComplete = new google.maps.places.Autocomplete(input, option);
var input2 = document.getElementById(`destination`);
var autoComplete2 = new google.maps.places.Autocomplete(input2, option);

// EventListener for search
$(`#searchBtn`).on(`click`, () =>
  calcRoute(directionsRenderer, directionsService)
);

//create a function that calculate the distance and render on the map
function calcRoute(directionsRenderer, directionsService) {
    console.log(`click`);
    var request = {
        origin: $(`#origin`).val(),
        destination: $(`#park`).val(), //change it to the user picked value for park
        travelMode: google.maps.TravelMode[$(`#mode`).val()],
        unitSystem: google.maps.UnitSystem.METRIC, //can create an option for user
    };
}

  //pass request to the route method
  directionsService.route(request, function (result, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      //get distance and time
      var distance = $(`<p>`).append(
        `Distance: ` + result.routes[0].legs[0].distance.text
      );
      var duration = $(`<p>`).append(
        `Duration: ` + result.routes[0].legs[0].duration.text
      );
      console.log(result);
      $(`#distance`).empty();
      $(`#time`).empty();
      $(`#error`).empty();

      $(`#distance`).append(distance);
      $(`#time`).append(duration);

      //display route on map
      directionsRenderer.setDirections(result);
    } else {
      //delete route
      directionsRenderer.setDirections({ routes: [] });

      //center map
      map.setCenter({ lat: 43.65, lng: -79.35 });

      //Show error
      //could not retrieve the route
      var noResult = $(`<p>`).append(`Directions request returned no results!`);
      $(`#distance`).empty();
      $(`#time`).empty();
      $(`#error`).empty();

      $(`#error`).append(noResult);
    }
  });

function displayLinks() {
  var x = document.getElementById("selections");
  if (x.className.indexOf("w3-show") == -1) {
    x.className += " w3-show";
  } else {
    x.className = x.className.replace(" w3-show", "");
  }
}

function weatherAPI()
{
    let weatherURL = "https://api.weather.gc.ca/collections/climate-daily/items";
    let formatURL = "?f=json";
    let year = "&LOCAL_YEAR=2020";
    let station = "&CLIMATE_IDENTIFIER=605DJ25";
    let finalURL = "";

    if (station)
    {
        finalURL = weatherURL + formatURL + year + station;
    }

    console.log(finalURL);

    // 6115811.2021.2.12
    // https://api.weather.gc.ca/collections/climate-stations/items?limit=100&startindex=0&COUNTRY=CAN&DLY_LAST_DATE=2022-11-14+00%3A00%3A00&ENG_PROV_NAME=ontario

    fetch(finalURL)
        .then(function (response)
        {
            if (!response.ok)
            {
                throw response.json();
            }
            return response.json();
        })
        .then(function (jsonResult)
        {
            console.log(jsonResult.features.length);
            console.log(`Temp: ${jsonResult.features[jsonResult.features.length - 1].properties.MEAN_TEMPERATURE}`);
            console.log(`Rain: ${jsonResult.features[jsonResult.features.length - 1].properties.TOTAL_PRECIPITATION}`);
            console.log(jsonResult);
        })
        .catch(function (error)
        {
            console.error(error);
        });

    fetch("https://api.weather.gc.ca/collections/climate-daily/items?f=json&ID=6115811.2021.2.12")
        .then(function (response)
        {
            if (!response.ok)
            {
                throw response.json();
            }
            return response.json();
        })
        .then(function (jsonResult)
        {
            console.log(jsonResult.features.length);
            console.log(`Temp: ${jsonResult.features[jsonResult.features.length - 1].properties.MEAN_TEMPERATURE}`);
            console.log(`Rain: ${jsonResult.features[jsonResult.features.length - 1].properties.TOTAL_PRECIPITATION}`);
            console.log(jsonResult);
        })
        .catch(function (error)
        {
            console.error(error);
        });
}

weatherAPI();
