import { WeatherData } from "@/lib/weatherApi";

interface ForecastProps {
  weatherData: WeatherData;
  className?: string;
}

export default function Forecast({
  weatherData,
  className = "",
}: ForecastProps) {
  // Convert Celsius to Fahrenheit
  const celsiusToFahrenheit = (celsius: number) => {
    return Math.round((celsius * 9) / 5 + 32);
  };

  return (
    <div className={`p-6 rounded-lg ${className}`}>
      <h2 className="text-2xl font-semibold mb-4">5-Day Forecast</h2>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {weatherData.forecast.map((day, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-lg shadow text-center"
          >
            <p className="font-semibold">
              {new Date(day.date + "T00:00:00-07:00").toLocaleDateString(
                "en-US",
                {
                  timeZone: "America/Los_Angeles",
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                }
              )}
            </p>
            <img
              src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
              alt={day.weather[0].description}
              className="w-16 h-16 mx-auto"
            />
            <p className="text-lg font-bold">
              {celsiusToFahrenheit(day.temp.max)}°F
            </p>
            <p className="text-sm text-gray-600">
              {day.weather[0].description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
