interface SearchFormProps {
  location: string;
  startDate: string;
  endDate: string;
  loading: boolean;
  onLocationChange: (value: string) => void;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function SearchForm({
  location,
  startDate,
  endDate,
  loading,
  onLocationChange,
  onStartDateChange,
  onEndDateChange,
  onSubmit,
}: SearchFormProps) {
  return (
    <form onSubmit={onSubmit} className="mb-8">
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <input
            type="text"
            value={location}
            onChange={(e) => onLocationChange(e.target.value)}
            placeholder="Enter location (city, zip code, etc.)"
            className="flex-1 p-2 border rounded"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {loading ? "Loading..." : "Get Weather"}
          </button>
        </div>
        <div className="flex gap-4">
          <input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="p-2 border rounded"
            required
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="p-2 border rounded"
            required
          />
        </div>
      </div>
    </form>
  );
}
