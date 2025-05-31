interface ExportButtonsProps {
  onExport: (format: "json" | "csv" | "markdown") => void;
}

export default function ExportButtons({ onExport }: ExportButtonsProps) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Export Data</h2>
      <div className="flex gap-4">
        <button
          onClick={() => onExport("json")}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Export JSON
        </button>
        <button
          onClick={() => onExport("csv")}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Export CSV
        </button>
        <button
          onClick={() => onExport("markdown")}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Export Markdown
        </button>
      </div>
    </div>
  );
}
