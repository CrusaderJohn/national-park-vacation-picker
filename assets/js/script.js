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

weather();
