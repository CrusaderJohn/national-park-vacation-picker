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