interface DefaultToolCardProps {
  name: string;
  args?: Record<string, unknown>;
  result?: unknown;
}

export function DefaultToolCard({ name, args, result }: DefaultToolCardProps) {
  return (
    <details className="border border-gray-300 rounded-lg overflow-hidden">
      <summary className="cursor-pointer p-3 bg-gray-50 hover:bg-gray-100 transition-colors font-medium text-sm">
        {name}
      </summary>
      <div className="p-3 bg-white border-t border-gray-200 space-y-2">
        {args && (
          <div>
            <div className="text-xs font-semibold text-gray-600 mb-1">
              Arguments:
            </div>
            <pre className="text-xs bg-gray-50 p-2 rounded overflow-auto">
              {JSON.stringify(args, null, 2)}
            </pre>
          </div>
        )}
        {result !== undefined && result !== null && (
          <div>
            <div className="text-xs font-semibold text-gray-600 mb-1">
              Result:
            </div>
            <pre className="text-xs bg-gray-50 p-2 rounded overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </details>
  );
}

