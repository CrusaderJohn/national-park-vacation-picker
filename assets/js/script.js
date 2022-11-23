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

function weather()
{
    console.log("test");

    let weatherURL = "https://api.weather.gc.ca/collections/climate-daily/items";
    let formatURL = "?f=json";
    let year = "&LOCAL_YEAR=2021";
    let station = "&CLIMATE_IDENTIFIER=6115811";
    let finalURL = "";
    let hottestDay = -200;
    let weekSum = 0;
    let weekAvg = 0;

    class Day {
        constructor(year, month, day, temp, rain, longDay) {
            this.year = year;
            this.month = month;
            this.day = day;
            this.temp = temp;
            this.rain = rain;
            this.longDay = longDay;
        }
    }

    class Year {
        constructor() {
            this.days = [];
            this.hotWeekTemp = -200;
            this.hotWeekDay = 0;
            this.dryWeek = -200;
            this.dryWeekDay = 0;
        }
    }

    finalURL = weatherURL + formatURL + year + station;
    let newYear = new Year(2021);

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
            for (let i = 0; i < jsonResult.features.length; i++) {
                // console.log(newYear);
                newYear.days.push(new Day(
                    jsonResult.features[i].properties.LOCAL_YEAR,
                    jsonResult.features[i].properties.LOCAL_MONTH,
                    jsonResult.features[i].properties.LOCAL_DAY,
                    jsonResult.features[i].properties.MEAN_TEMPERATURE,
                    jsonResult.features[i].properties.TOTAL_PRECIPITATION,
                    jsonResult.features[i].properties.LOCAL_DATE));
            }

            // The below lines sort the array of days into chronological order.
            // Based off: https://www.javascripttutorial.net/array/javascript-sort-an-array-of-objects/
            newYear.days.sort((a, b) => {
                let da = new Date(a.longDay);
                let db = new Date(b.longDay);
                return da - db;
            });

            for (let i = 0; i < jsonResult.features.length - 7; i++)
            {
                weekSum = newYear.days[i].temp + newYear.days[i+1].temp + newYear.days[i+2].temp +
                    newYear.days[i+3].temp + newYear.days[i+4].temp + newYear.days[i+5].temp + newYear.days[i+6].temp;
                weekAvg = weekSum / 7;
                if (weekAvg > newYear.hotWeekTemp)
                {
                    newYear.hotWeekTemp = weekAvg;
                    newYear.hotWeekDay = newYear.days[i].longDay;
                }
            }

            for (let i = 0; i < jsonResult.features.length - 7; i++)
            {
                weekSum = newYear.days[i].rain + newYear.days[i+1].rain + newYear.days[i+2].rain +
                    newYear.days[i+3].rain + newYear.days[i+4].rain + newYear.days[i+5].rain + newYear.days[i+6].rain;
                weekAvg = weekSum / 7;
                if (weekAvg > newYear.dryWeek)
                {
                    newYear.dryWeek = weekAvg;
                    newYear.dryWeekDay = newYear.days[i].longDay;
                }
            }

            console.log(newYear.hotWeekDay);
            console.log(newYear.dryWeekDay);

        })
        .catch(function (error)
        {
            console.error(error);
        });
}

weather();
