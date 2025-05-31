interface WeatherRecord {
  id: string;
  location: string;
  timestamp: string;
  startDate: string;
  endDate: string;
}

interface WeatherRecordsProps {
  records: WeatherRecord[];
  onUpdate: (record: WeatherRecord) => void;
  onDelete: (id: string) => void;
}

export default function WeatherRecords({
  records,
  onUpdate,
  onDelete,
}: WeatherRecordsProps) {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Previous Records</h2>
      <div className="space-y-4">
        {records.map((record) => (
          <div key={record.id} className="p-4 bg-white rounded-lg shadow">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">{record.location}</p>
                <p className="text-gray-600">
                  {new Date(record.timestamp).toLocaleString("en-US", {
                    timeZone: "America/Los_Angeles",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <p className="text-sm text-gray-500">
                  {record.startDate} to {record.endDate}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onUpdate(record)}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Update
                </button>
                <button
                  onClick={() => onDelete(record.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
