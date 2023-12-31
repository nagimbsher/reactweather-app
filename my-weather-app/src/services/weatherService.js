import { DateTime } from "luxon";

const API_KEY = '6bc236fa8bd5e7e03f83fd8cea3eac74';
const BASE_URL = 'https://api.openweathermap.org/data/2.5'


const getWeatherData = (infoType, searchParams) => {
    const url = new URL(BASE_URL + "/" + infoType);
    url.search = new URLSearchParams({ ...searchParams, appid:API_KEY});

    return fetch(url).then((res) => res.json());
};

const formatCurrentWeather = (data, timezone = "GMT") => {
    const {
        coord: { lat, lon },
        main: { temp, feels_like, humidity },
        name,
        dt,
        sys: {country},
        weather,
        wind: { speed },
    } = data;

    const { main: details, icon } = weather[0];

    const CountryLocalTime = formatToLocalTime(dt, timezone);

    return {
        lat,
        lon,
        temp,
        feels_like,
        humidity,
        name,
        dt,
        country,
        details,
        icon,
        speed,
       CountryLocalTime,
    };
};

const getFormattedWeatherData = async (searchParams) => {
    const formattedCurrentWeather = await getWeatherData(
        "weather",
        searchParams
    ).then(formatCurrentWeather);

    const { lat, lon } = formattedCurrentWeather;


    const formattedForecastWeather = await getThreeHourlyForecast({
        lat,
        lon,
        units: searchParams.units,
    });

    console.log("formattedForecastWeather: ", formattedForecastWeather);

    const forecast = [];
    for (let key in formattedForecastWeather.list) {
        const weatherData = formattedForecastWeather.list[key];
        const {
            dt,
            main: { temp },
            weather,
            wind: { speed },
        } = weatherData;

        const { icon } = weather[0];

        const CountryLocalTime = formatToLocalTime(
            dt,
            formattedForecastWeather.city.timezone
        );

        const forecastData = {
            dt,
            temp,
            icon,
            speed,
            CountryLocalTime,
        };

        forecast.push(forecastData);
    }

    console.log("forecast: ", forecast);

    return { ...formattedCurrentWeather, forecast };
};

const getThreeHourlyForecast = async (searchParams) => {
    const formattedForecastWeather = await getWeatherData("forecast", {
        ...searchParams,
        units: searchParams.units,
    });

    return formattedForecastWeather;
};

const formatToLocalTime = (
    secs,
    zone,
    format = "cccc, dd LLL yyyy' | Local time: 'hh:mm a"
) => DateTime.fromSeconds(secs).setZone(zone).toFormat(format);

const iconUrlFromCode = (code) =>
    `http://openweathermap.org/img/wn/${code}@2x.png`;

export default getFormattedWeatherData;


export { formatToLocalTime, iconUrlFromCode };





