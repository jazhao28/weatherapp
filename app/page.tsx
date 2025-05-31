"use client";

import { useState, useEffect } from "react";
import {
  WeatherData,
  fetchWeatherData,
  createWeatherRecord,
  getWeatherRecords,
  updateWeatherRecord,
  deleteWeatherRecord,
  exportToJson,
  exportToCsv,
  exportToMarkdown,
} from "@/lib/weatherApi";
import SearchForm from "./components/SearchForm";
import CurrentWeather from "./components/CurrentWeather";
import Forecast from "./components/Forecast";
import ExportButtons from "./components/ExportButtons";
import WeatherRecords from "./components/WeatherRecords";
import UpdateModal from "./components/UpdateModal";

export default function Home() {
  const [location, setLocation] = useState(""); // Location
  const [startDate, setStartDate] = useState(""); // Start date
  const [endDate, setEndDate] = useState(""); // End date
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null); // Weather data
  const [records, setRecords] = useState<any[]>([]); // Weather records
  const [error, setError] = useState(""); 
  const [loading, setLoading] = useState(false); // Loading state
  const [selectedRecord, setSelectedRecord] = useState<any>(null); // Modal for updating weather data
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal for updating weather data
  const [updateStartDate, setUpdateStartDate] = useState(""); // Start date for updating weather data
  const [updateEndDate, setUpdateEndDate] = useState(""); // End date for updating weather data
  const [updateWeatherData, setUpdateWeatherData] =
    useState<WeatherData | null>(null); // Weather data for updating weather data

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    try {
      const data = await getWeatherRecords();
      setRecords(data);
    } catch (err) {
      setError("Failed to load weather records");
    }
  };

  const validateDates = (start: string, end: string) => {
    const startDate = new Date(start + "T00:00:00-07:00"); // Pacific Time
    const endDate = new Date(end + "T00:00:00-07:00"); // Pacific Time
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (startDate > endDate) {
      throw new Error("Start date cannot be after end date");
    }

    if (startDate < today) {
      throw new Error("Start date cannot be in the past");
    }

    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 5) {
      throw new Error("Date range cannot exceed 5 days");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      validateDates(startDate, endDate);
      const data = await fetchWeatherData(location, startDate, endDate);
      setWeatherData(data);
      await createWeatherRecord({
        ...data,
        startDate,
        endDate,
      });
      await loadRecords();
    } catch (err: any) {
      setError(err.message || "Failed to fetch weather data");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteWeatherRecord(id);
      setRecords(records.filter((record) => record.id !== id));
    } catch (err) {
      setError("Failed to delete record");
    }
  };

  const handleExport = (format: "json" | "csv" | "markdown") => {
    try {
      let content = "";
      let filename = "";
      let mimeType = "";

      switch (format) {
        case "json":
          content = exportToJson(records);
          filename = "weather-data.json";
          mimeType = "application/json";
          break;
        case "csv":
          content = exportToCsv(records);
          filename = "weather-data.csv";
          mimeType = "text/csv";
          break;
        case "markdown":
          content = exportToMarkdown(records);
          filename = "weather-data.md";
          mimeType = "text/markdown";
          break;
      }

      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError("Failed to export data");
    }
  };

  const handleUpdate = async (record: any) => {
    setSelectedRecord(record);
    setUpdateStartDate(record.startDate);
    setUpdateEndDate(record.endDate);
    setUpdateWeatherData(record);
    setIsModalOpen(true);
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      validateDates(updateStartDate, updateEndDate);
      const data = await fetchWeatherData(
        selectedRecord.location,
        updateStartDate,
        updateEndDate
      );
      await updateWeatherRecord(selectedRecord.id, {
        ...data,
        startDate: updateStartDate,
        endDate: updateEndDate,
      });
      await loadRecords();
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.message || "Failed to update weather data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Weather App</h1>

        <SearchForm
          location={location}
          startDate={startDate}
          endDate={endDate}
          loading={loading}
          onLocationChange={setLocation}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onSubmit={handleSubmit}
        />

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {weatherData && (
          <>
            <CurrentWeather weatherData={weatherData} />
            <Forecast weatherData={weatherData} />
          </>
        )}

        <ExportButtons onExport={handleExport} />

        <WeatherRecords
          records={records}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />

        <UpdateModal
          isOpen={isModalOpen}
          selectedRecord={selectedRecord}
          updateStartDate={updateStartDate}
          updateEndDate={updateEndDate}
          loading={loading}
          updateWeatherData={updateWeatherData}
          onClose={() => setIsModalOpen(false)}
          onStartDateChange={setUpdateStartDate}
          onEndDateChange={setUpdateEndDate}
          onSubmit={handleUpdateSubmit}
        />
      </div>
    </main>
  );
}
