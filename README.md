# Weather App

This is a web-based weather app built with Next.js, TailwindCSS, and Firebase that providing weather conditions of a given city, country or zipcode.

## Features

### Core Weather Features

- Current weather display with temperature, feels like, humidity, wind speed, time (PST time zone)
- 5-day weather forecast with daily temperatures and conditions
- Temperature display in Fahrenheit
- Weather icons for different conditions


### APIs used

- New York Times API integration for location-based news
- OpenWeatherMap API for weather data

### CRUD operations for managing weather data

- Date range selection for weather data
- Data validation:
  - Start date cannot be after end date
  - Start date cannot be in the past
  - Date range cannot exceed 5 days

### Export Formats for Data
  - JSON
  - CSV
  - Markdown



### TechStack

- Next.js 
- TypeScript
- Tailwind CSS
- Firebase for data storage

## How to run

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file with required API keys
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
app/
├── components/         # React components
│   ├── CurrentWeather.tsx
│   ├── Forecast.tsx
│   ├── LocationNews.tsx
│   ├── SearchForm.tsx
│   ├── UpdateModal.tsx
│   └── WeatherRecords.tsx
├── lib/               # Utility functions and API calls
│   └── weatherApi.ts
└── page.tsx          # Main application page
```

## API Integration

### OpenWeather API

- Current weather data
- 5-day forecast
- Weather icons and descriptions

### Google Maps API

- Location display
- Geocoding for address lookup

### New York Times API

- Location-based news articles
- Latest updates for searched locations

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request
# weatherapp
