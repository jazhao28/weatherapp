import { WeatherData } from "@/lib/weatherApi";
import CurrentWeather from "./CurrentWeather";
import Forecast from "./Forecast";

interface UpdateModalProps {
  isOpen: boolean;
  selectedRecord: any;
  updateStartDate: string;
  updateEndDate: string;
  loading: boolean;
  updateWeatherData: WeatherData | null;
  onClose: () => void;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function UpdateModal({
  isOpen,
  selectedRecord,
  updateStartDate,
  updateEndDate,
  loading,
  updateWeatherData,
  onClose,
  onStartDateChange,
  onEndDateChange,
  onSubmit,
}: UpdateModalProps) {
  if (!isOpen || !selectedRecord) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Update Weather Record</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <form onSubmit={onSubmit} className="mb-6">
          <div className="flex gap-4 mb-4">
            <input
              type="date"
              value={updateStartDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              className="p-2 border rounded"
              required
            />
            <input
              type="date"
              value={updateEndDate}
              onChange={(e) => onEndDateChange(e.target.value)}
              className="p-2 border rounded"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
              {loading ? "Updating..." : "Update Forecast"}
            </button>
          </div>
        </form>

        {updateWeatherData && (
          <>
            <CurrentWeather weatherData={updateWeatherData} />
            <Forecast weatherData={updateWeatherData} className="bg-gray-50" />
          </>
        )}
      </div>
    </div>
  );
}
