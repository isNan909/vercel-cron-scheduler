import mailgun from "mailgun-js";

const KEY = process.env.API_KEY;
const DOMAIN = process.env.DOMAIN;
const WEATHER_KEY = process.env.WEATHER_API_KEY;

export async function GET(req, res) {
  const mg = mailgun({apiKey: KEY, domain: DOMAIN});

  const city = 'New York, NY';
  const countryCode = 'US';

  const locationEndpoint = `http://dataservice.accuweather.com/locations/v1/cities/${countryCode}/search`;
  const locationRequest = await fetch(`${locationEndpoint}?q=${encodeURIComponent(city)}&apikey=${WEATHER_KEY}`);
  const locationData = await locationRequest.json();

  const locationKey = locationData[0].Key;
  const forecastEndpoint = `http://dataservice.accuweather.com/forecasts/v1/daily/1day/${locationKey}`;
  const forecastRequest = await fetch(`${forecastEndpoint}?apikey=${WEATHER_KEY}`);
  const forecastData = await forecastRequest.json();

  const data = {
    from: 'Weather News <mailgun@VERCEL_CRON_EMAIL>',
    to: 'forthosewhocode@gmail.com',
    subject: 'Your Daily Weather Report',
    text: `
    ${forecastData?.Headline?.Text}
    ${forecastData?.Headline?.Category}
    Temp Min: ${forecastData.DailyForecasts[0].Temperature.Minimum.Value}° ${forecastData.DailyForecasts[0].Temperature.Minimum.Unit}
    Temp Max: ${forecastData.DailyForecasts[0].Temperature.Maximum.Value}° ${forecastData.DailyForecasts[0].Temperature.Maximum.Unit}
    Visit link: ${forecastData?.Headline?.Link}
    `
  };

  mg.messages().send(data, function (error, body) {
    if(error){
      console.log(error);
      res.status(500).send({ message: 'Error in sending email' });
    }
    console.log(body?.message);
  });

  return new Response('Email was sent!', {
    status: 200
  });
}
