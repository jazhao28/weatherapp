import { WeatherData } from "@/lib/weatherApi";
import dynamic from "next/dynamic";

// Dynamically import the LocationNews component with no SSR
const LocationNews = dynamic(() => import("./LocationNews"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[200px] bg-gray-100 rounded-lg animate-pulse" />
  ),
});

interface CurrentWeatherProps {
  weatherData: WeatherData;
}

export default function CurrentWeather({ weatherData }: CurrentWeatherProps) {
  // Convert Celsius to Fahrenheit
  const celsiusToFahrenheit = (celsius: number) => {
    return Math.round((celsius * 9) / 5 + 32);
  };

  return (
    <div className="mb-8 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4">{weatherData.location}</h2>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-4xl font-bold">
            {celsiusToFahrenheit(weatherData.current.temp)}°F
          </p>
          <div className="flex items-center gap-2">
            <img
              src={`https://openweathermap.org/img/wn/${weatherData.current.weather[0].icon}@2x.png`}
              alt={weatherData.current.weather[0].description}
              className="w-12 h-12"
            />
            <p className="text-gray-600">
              {weatherData.current.weather[0].description}
            </p>
          </div>
        </div>
        <div>
          <p>
            Feels like: {celsiusToFahrenheit(weatherData.current.feels_like)}°F
          </p>
          <p>Humidity: {weatherData.current.humidity}%</p>
          <p>Wind: {weatherData.current.wind_speed} m/s</p>
        </div>
      </div>
      <LocationNews location={weatherData.location} />
    </div>
  );
}
