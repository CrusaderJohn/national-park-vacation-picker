function weatherAPI()
{
    let weatherURL = "https://api.weather.gc.ca/collections/climate-daily/items";
    let formatURL = "?f=json";
    let year = "&LOCAL_YEAR=1989";
    let station = "&CLIMATE_IDENTIFIER=666";
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
            console.log(jsonResult);
        })
        .catch(function (error)
        {
            console.error(error);
        });
}