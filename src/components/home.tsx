import React from "react";

type Container = {
  id: string;
  name: string;
  image: string;
  status: "initializing" | "running" | "stopped";
  logs: string[];
  createdAt: number;
};

type HomeProps = {
  running: Container[];
  containers: Container[];
  onViewLogs: (id: string) => void;
};

export default function HomeTab({
  running,
  containers,
  onViewLogs,
}: HomeProps) {
  return (
    <section className="space-y-6">
      {/* Running Containers */}
      <div>
        <h4 className="mb-3 text-lg font-medium">Running Containers</h4>
        <div className="space-y-3">
          {running.length === 0 && (
            <div className="rounded border border-dashed p-4 text-center text-sm text-zinc-500">
              No running containers
            </div>
          )}
          {running.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between rounded border p-4 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition"
            >
              <div className="flex items-center gap-4">
                <span
                  className={`inline-block h-3 w-3 rounded-full ${
                    c.status === "running"
                      ? "bg-green-500"
                      : c.status === "initializing"
                        ? "bg-yellow-400"
                        : "bg-gray-400"
                  }`}
                />
                <div>
                  <div className="font-medium">{c.name}</div>
                  <div className="text-sm text-zinc-600 dark:text-zinc-400">
                    {c.image} • {c.status}
                  </div>
                </div>
              </div>
              <button
                onClick={() => onViewLogs(c.id)}
                className="rounded border px-3 py-1.5 text-sm hover:bg-zinc-200 dark:hover:bg-zinc-800 transition"
              >
                View Logs
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Containers */}
      <div>
        <h4 className="mb-3 text-lg font-medium">Recent Containers</h4>
        <div className="grid gap-3 sm:grid-cols-2">
          {containers.length === 0 && (
            <div className="rounded border border-dashed p-4 text-center text-sm text-zinc-500 sm:col-span-2">
              No recent containers
            </div>
          )}
          {containers.slice(0, 6).map((c) => (
            <div
              key={c.id}
              className="rounded border p-3 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-900 transition cursor-pointer"
              onClick={() => onViewLogs(c.id)}
            >
              <div className="font-medium">{c.name}</div>
              <div className="text-xs text-zinc-500 mt-1">
                {c.image} • {c.status}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Images */}
      <div>
        <h4 className="mb-3 text-lg font-medium">Recent Images</h4>
        <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {Array.from(new Set(containers.map((c) => c.image))).length === 0 ? (
            <div className="col-span-full rounded border border-dashed p-4 text-center text-sm text-zinc-500">
              No recent images
            </div>
          ) : (
            Array.from(new Set(containers.map((c) => c.image)))
              .slice(0, 8)
              .map((img) => (
                <div
                  key={img}
                  className="rounded border p-2 text-xs text-center hover:bg-zinc-100 dark:hover:bg-zinc-900 transition"
                >
                  {img}
                </div>
              ))
          )}
        </div>
      </div>
    </section>
  );
}
