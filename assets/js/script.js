//this function make sure the apis load after the html is loaded
$(function () {
    var userSelection = JSON.parse(localStorage.getItem("selection")) || [];

    // adding eventlistener for all the listed park
    for (let i = 0; i < 22; i++) {
        id = `#park-selection-btn` + i;
        // console.log(id);
        $(id).on(`click`, function () {
            // console.log($(this)[0].getAttribute("value"));
            var selectedPark = $(this)[0].getAttribute("value");
            if (userSelection.includes(selectedPark)) {
                document.getElementById("modal-container").style.display = "block";
                return;
            }
            $(`.landing-page`).addClass(`hidden`);
            $(`.result-page`).removeClass(`hidden`);
            weatherAPI();
            userSelection.push(selectedPark);
            localStorage.setItem(`selection`, JSON.stringify(userSelection));
            searchHistory(selectedPark);
            // EventListener for search
            $(`#searchBtn`).on(`click`, () =>
                calcRoute(directionsRenderer, directionsService, selectedPark)
            );
        });
    }

    //event listener for search history btn on the main page
    $(`#search-history-btn`).on(`click`, function () {
        $(`.landing-page`).addClass(`hidden`);
        $(`.result-page`).removeClass(`hidden`);
    });

    //event listener for return landing page on result page
    $(`#landing-page-btn`).on(`click`, function () {
        location.reload();
    });

    //create a search history fot all the parks
    function searchHistory(selectedPark) {
        console.log(selectedPark);
        var newList = $(`<li>`);
        var create = $("<button>");

        create.attr(
            "class",
            "w3-btn w3-white w3-border w3-border-green w3-round-xlarge"
        );
        create.attr("id", "parkBtn");
        create.text(selectedPark);
        newList.append(create);
        create.on(`click`, searchHistoryBtn);
        $(`#search-history`).prepend(newList);
    }

    const google = window.google;

    // Create a map and center it on Toronto.
    var directionsRenderer, directionsService, map;
    var mapOptions = {
        zoom: 12,
        center: { lat: 43.65, lng: -79.35 },
    };
    map = new google.maps.Map(document.getElementById(`map`), mapOptions);

    // Instantiate a directions service.
    directionsService = new google.maps.DirectionsService();

    // Create a renderer for directions and bind it to the map.
    var rendererOptions = {
        map: map,
    };
    directionsRenderer = new google.maps.DirectionsRenderer(rendererOptions);
    directionsRenderer.setMap(map);

    //add autoComplete for user
    var option = {
        types: [`establishment`],
        componentRestrictions: { country: [`ca`] },
    };
    var input = $(`#origin`)[0];
    var autoComplete = new google.maps.places.Autocomplete(input, option);

    //create function for search history btn
    function searchHistoryBtn() {
        var btnRequest = $(this).text();
        console.log(btnRequest);
        calcRoute(directionsRenderer, directionsService, btnRequest);
        weatherAPI();
    }

    //create a function that calculate the distance and render on the map
    function calcRoute(
        directionsRenderer,
        directionsService,
        selectedPark,
        btnRequest
    ) {
        console.log(`click`);
        var request = {
            origin: $(`#origin`).val(),
            destination: selectedPark || btnRequest, //change it to the user picked value for park
            travelMode: google.maps.TravelMode[$(`#mode`).val()],
            unitSystem: google.maps.UnitSystem.METRIC, //can create an option for user
        };

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
                var noResult = $(`<p>`).append(
                    `Directions request returned no results! Please try another mode of travel!`
                );
                $(`#distance`).empty();
                $(`#time`).empty();
                $(`#error`).empty();

                $(`#error`).append(noResult);
            }
        });
    }

    //weather API
    function weather()
    {
        console.log("test");

        let weatherURL = "https://api.weather.gc.ca/collections/climate-daily/items";
        let formatURL = "?f=json";
        let year = "&LOCAL_YEAR=2021";
        let station = "&CLIMATE_IDENTIFIER=6115811";
        let finalURL = "";

        finalURL = weatherURL + formatURL + year + station;

        class Day {
            constructor(temp, rain, longDay) {
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
                this.weekSum = 0;
                this.weekAvg = 0;
            }
        }

        let newYear = new Year();

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
                    newYear.days.push(new Day(
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
                    newYear.weekSum = newYear.days[i].temp + newYear.days[i+1].temp + newYear.days[i+2].temp +
                        newYear.days[i+3].temp + newYear.days[i+4].temp + newYear.days[i+5].temp + newYear.days[i+6].temp;
                    newYear.weekAvg = newYear.weekSum / 7;
                    if (newYear.weekAvg > newYear.hotWeekTemp)
                    {
                        newYear.hotWeekTemp = newYear.weekAvg;
                        newYear.hotWeekDay = newYear.days[i].longDay;
                    }
                }

                for (let i = 0; i < jsonResult.features.length - 7; i++)
                {
                    newYear.weekSum = newYear.days[i].rain + newYear.days[i+1].rain + newYear.days[i+2].rain +
                        newYear.days[i+3].rain + newYear.days[i+4].rain + newYear.days[i+5].rain + newYear.days[i+6].rain;
                    newYear.weekAvg = newYear.weekSum / 7;
                    if (newYear.weekAvg > newYear.dryWeek)
                    {
                        newYear.dryWeek = newYear.weekAvg;
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

    //clear search history
    $(`#clear-history-btn`).on(`click`, clearSearchHistory);
    function clearSearchHistory() {
        window.location.reload();
        localStorage.clear();
        $(`#search-history`).empty();
        userSelection.empty();
        window.location.reload();
    }

    // print localstorage city name to the search History
    for (let i = 0; i < userSelection.length; i++) {
        searchHistory(userSelection[i]);
    }
});

//function for displaying drawdown list
function displayLinks() {
    var x = document.getElementById("selections");
    if (x.className.indexOf("w3-show") == -1) {
        x.className += " w3-show";
    } else {
        x.className = x.className.replace(" w3-show", "");
    }
}
