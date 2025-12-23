type WeatherResult = {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  feelsLike: number;
};

// Loading component with spinner
function WeatherLoading({ location }: { location?: string }) {
  return (
    <div
      style={{ backgroundColor: "black" }}
      className="rounded-xl shadow-xl mt-6 mb-4 max-w-md w-full"
    >
      <div className="bg-white/20 p-4 w-full">
        <div className="flex flex-col items-center justify-center py-8">
          <div className="relative w-12 h-12 mb-4">
            <div className="absolute inset-0 border-4 border-white/30 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-white text-center">
            Loading weather for {location || "your location"}
          </p>
        </div>
      </div>
    </div>
  );
}

// Content component for displaying weather data
function WeatherContent({
  location,
  result,
}: {
  location?: string;
  result?: WeatherResult;
}) {
  return (
    <div
      style={{ backgroundColor: "black" }}
      className="rounded-xl shadow-xl mt-6 mb-4 max-w-md w-full"
    >
      <div className="bg-white/20 p-4 w-full">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white capitalize">
              {location}
            </h3>
            <p className="text-white">Current Weather</p>
          </div>
          <SunIcon />
        </div>

        <div className="mt-4 flex items-end justify-between">
          <div className="text-3xl font-bold text-white">
            {result?.temperature}°
          </div>
          <div className="text-sm text-white">{result?.condition}</div>
        </div>

        <div className="mt-4 pt-4 border-t border-white">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-white text-xs">Humidity</p>
              <p className="text-white font-medium">{result?.humidity}%</p>
            </div>
            <div>
              <p className="text-white text-xs">Wind</p>
              <p className="text-white font-medium">{result?.windSpeed} mph</p>
            </div>
            <div>
              <p className="text-white text-xs">Feels Like</p>
              <p className="text-white font-medium">{result?.feelsLike}°</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Weather card component where the location and themeColor are based on what the agent
// sets via tool calls.
export function WeatherCard({
  location,
  status,
  result,
}: {
  location?: string;
  status?: string;
  result?: WeatherResult;
}) {
  if (status !== "complete") {
    return <WeatherLoading location={location} />;
  }

  return <WeatherContent location={location} result={result} />;
}

// Simple sun icon for the weather card
function SunIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-14 h-14 text-yellow-200"
    >
      <circle cx="12" cy="12" r="5" />
      <path
        d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
        strokeWidth="2"
        stroke="currentColor"
      />
    </svg>
  );
}
