
import { useEffect, useState } from "react";

type Earthquake = {
  id: string;
  properties: {
    mag: number;
    place: string;
    time: number;
    url: string;
  };
  geometry: {
    coordinates: [number, number, number];
  };
};

const SPAIN_BBOX = {
  minlatitude: 36,
  maxlatitude: 44,
  minlongitude: -9.5,
  maxlongitude: 4,
};

const FIFTY_YEARS_AGO = new Date();
FIFTY_YEARS_AGO.setFullYear(FIFTY_YEARS_AGO.getFullYear() - 50);

function App() {
  const [earthquakes, setEarthquakes] = useState<Earthquake[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterSpain, setFilterSpain] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchEarthquakes = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        format: "geojson",
        starttime: FIFTY_YEARS_AGO.toISOString().split("T")[0],
        endtime: new Date().toISOString().split("T")[0],
        minlatitude: String(SPAIN_BBOX.minlatitude),
        maxlatitude: String(SPAIN_BBOX.maxlatitude),
        minlongitude: String(SPAIN_BBOX.minlongitude),
        maxlongitude: String(SPAIN_BBOX.maxlongitude),
        limit: "20000", // USGS API max limit
      });
      const res = await fetch(
        `https://earthquake.usgs.gov/fdsnws/event/1/query?${params}`
      );
      const data = await res.json();
      setEarthquakes(data.features || []);
      setLastUpdate(new Date());
    } catch (e: any) {
      setError(e.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEarthquakes();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
        Earthquakes in Spain (Last 50 Years)
      </h1>
      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      {!loading && !error && (
        <div>
          <div className="mb-4 flex flex-col items-center gap-2">
            <button
              className={`px-4 py-2 rounded bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition ${filterSpain ? 'bg-blue-800' : ''}`}
              onClick={() => setFilterSpain((f) => !f)}
            >
              {filterSpain ? 'Show All Locations' : 'Show Only Spain Locations'}
            </button>
            <button
              className="px-4 py-2 rounded bg-green-600 text-white font-semibold shadow hover:bg-green-700 transition"
              onClick={fetchEarthquakes}
            >
              Refresh Results
            </button>
            {lastUpdate && (
              <span className="text-sm text-gray-700 mt-2">
                Última actualización: {lastUpdate.toLocaleString('es-ES', { dateStyle: 'full', timeStyle: 'medium' })}
              </span>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow rounded-lg">
              <thead>
                <tr>
                  <th className="px-4 py-2 border">Ismajor</th>
                  <th className="px-4 py-2 border">Date</th>
                  <th className="px-4 py-2 border">Magnitude</th>
                  <th className="px-4 py-2 border">Location</th>
                  <th className="px-4 py-2 border">Coordinates</th>
                  <th className="px-4 py-2 border">Details</th>
                </tr>
              </thead>
              <tbody>
                {[...earthquakes]
                  .filter(eq => !filterSpain || (eq.properties.place && eq.properties.place.toLowerCase().includes('spain')))
                  .sort((a, b) => (b.properties.mag ?? 0) - (a.properties.mag ?? 0))
                  .map((eq) => {
                    const isMajor = eq.properties.mag >= 5;
                    return (
                      <tr
                        key={eq.id}
                        className={
                          isMajor
                            ? "bg-red-700 text-red font-bold hover:bg-red-800"
                            : "bg-white text-gray-900 hover:bg-gray-100"
                        }
                      >
                        <td className="px-4 py-2 border">
                          {JSON.stringify(isMajor)}
                        </td>
                        <td className="px-4 py-2 border">
                          {new Date(eq.properties.time).toLocaleDateString()}
                        </td>
                        <td className={
                          "px-4 py-2 border text-center " + (isMajor ? "bg-red-900 text-yellow-300 font-extrabold" : "")
                        }>
                          {eq.properties.mag}
                        </td>
                        <td className="px-4 py-2 border">
                          {eq.properties.place}
                        </td>
                        <td className="px-4 py-2 border text-xs">
                          {eq.geometry.coordinates[1].toFixed(2)}, {eq.geometry.coordinates[0].toFixed(2)}
                        </td>
                        <td className="px-4 py-2 border text-center">
                          <a
                            href={eq.properties.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                          >
                            USGS
                          </a>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
            <p className="mt-4 text-sm text-gray-500 text-center">
              Showing {
                earthquakes.filter(eq => !filterSpain || (eq.properties.place && eq.properties.place.toLowerCase().includes('spain'))).length
              } earthquakes {filterSpain ? 'with Spain in location' : 'in Spain'} since {FIFTY_YEARS_AGO.getFullYear()}.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
