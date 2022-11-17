function weatherAPI()
{
    let weatherURL = "https://api.weather.gc.ca/collections/climate-daily/items";
    let formatURL = "?f=json";
    let year = "&LOCAL_YEAR=2020";
    let station = "&CLIMATE_IDENTIFIER=6115811";
    let finalURL = "";

    if (station)
    {
        finalURL = weatherURL + formatURL + year + station;
    }

    console.log(finalURL);

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
}

weatherAPI();