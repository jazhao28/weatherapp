import { db } from './firebase';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';

const OPENWEATHER_API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export interface WeatherData {
  location: string;
  startDate?: string;
  endDate?: string;
  current: {
    temp: number;
    feels_like: number;
    humidity: number;
    wind_speed: number;
    weather: Array<{
      main: string;
      description: string;
      icon: string;
    }>;
  };
  forecast: Array<{
    date: string;
    temp: {
      min: number;
      max: number;
    };
    weather: Array<{
      main: string;
      description: string;
      icon: string;
    }>;
  }>;
}

export const fetchWeatherData = async (location: string, startDate?: string, endDate?: string): Promise<WeatherData> => {
  try {
    // Fetch current weather
    const currentResponse = await fetch(
      `${BASE_URL}/weather?q=${location}&units=metric&appid=${OPENWEATHER_API_KEY}`
    );
    
    if (!currentResponse.ok) {
      throw new Error('Location not found');
    }

    const currentData = await currentResponse.json();

    // Fetch forecast (5 days with 3-hour intervals)
    const forecastResponse = await fetch(
      `${BASE_URL}/forecast?q=${location}&units=metric&appid=${OPENWEATHER_API_KEY}`
    );
    
    if (!forecastResponse.ok) {
      throw new Error('Forecast data not available');
    }

    const forecastData = await forecastResponse.json();

    // Process forecast data to get daily forecasts
    let dailyForecasts = forecastData.list.reduce((acc: any[], item: any) => {
      const date = new Date(item.dt * 1000).toISOString().split('T')[0];
      if (!acc.find((day: any) => day.date === date)) {
        acc.push({
          date,
          temp: {
            min: item.main.temp_min,
            max: item.main.temp_max,
          },
          weather: item.weather,
        });
      }
      return acc;
    }, []);

    // Filter forecasts based on date range if provided
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      dailyForecasts = dailyForecasts.filter((forecast: { date: string }) => {
        const forecastDate = new Date(forecast.date);
        return forecastDate >= start && forecastDate <= end;
      });
    }

    return {
      location: currentData.name,
      startDate,
      endDate,
      current: {
        temp: currentData.main.temp,
        feels_like: currentData.main.feels_like,
        humidity: currentData.main.humidity,
        wind_speed: currentData.wind.speed,
        weather: currentData.weather,
      },
      forecast: dailyForecasts,
    };
  } catch (error) {
    throw error;
  }
};

// CRUD Operations
export const createWeatherRecord = async (data: WeatherData) => {
  try {
    const docRef = await addDoc(collection(db, 'weatherRecords'), {
      ...data,
      timestamp: new Date().toISOString(),
    });
    return docRef.id;
  } catch (error) {
    throw new Error('Failed to create weather record');
  }
};

export const getWeatherRecords = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'weatherRecords'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    throw new Error('Failed to fetch weather records');
  }
};

export const updateWeatherRecord = async (id: string, data: Partial<WeatherData>) => {
  try {
    await updateDoc(doc(db, 'weatherRecords', id), {
      ...data,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    throw new Error('Failed to update weather record');
  }
};

export const deleteWeatherRecord = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'weatherRecords', id));
  } catch (error) {
    throw new Error('Failed to delete weather record');
  }
};

// Export functions
export const exportToJson = (data: any) => {
  return JSON.stringify(data, null, 2);
};

export const exportToCsv = (data: any[]) => {
  const headers = ['Location', 'Temperature', 'Weather', 'Date'];
  const rows = data.map(item => [
    item.location,
    item.current.temp,
    item.current.weather[0].main,
    new Date(item.timestamp).toLocaleDateString(),
  ]);
  return [headers, ...rows].map(row => row.join(',')).join('\n');
};

export const exportToMarkdown = (data: any[]) => {
  const headers = '| Location | Temperature | Weather | Date |\n|----------|------------|----------|------|\n';
  const rows = data.map(item => 
    `| ${item.location} | ${item.current.temp}°C | ${item.current.weather[0].main} | ${new Date(item.timestamp).toLocaleDateString()} |`
  ).join('\n');
  return headers + rows;
}; 