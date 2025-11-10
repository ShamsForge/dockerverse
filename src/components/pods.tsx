import React from "react";

type Container = {
  id: string;
  name: string;
  image: string;
  status: "initializing" | "running" | "stopped";
  logs: string[];
  createdAt: number;
};

type PodsProps = {
  containers: Container[];
  onViewDetails: (id: string) => void;
};

export default function PodsTab({ containers, onViewDetails }: PodsProps) {
  return (
    <section className="space-y-4">
      <div>
        <h4 className="mb-3 text-lg font-medium">All Containers</h4>
        <div className="space-y-3">
          {containers.length === 0 ? (
            <div className="rounded border border-dashed p-8 text-center text-sm text-zinc-500">
              No containers created yet. Start by creating one in the Home tab.
            </div>
          ) : (
            containers.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between rounded border p-4 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition"
              >
                <div className="flex-1">
                  <div className="font-medium">{c.name}</div>
                  <div className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                    <div>Image: {c.image}</div>
                    <div>Status: {c.status}</div>
                    <div className="text-xs mt-1">
                      Created: {new Date(c.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => onViewDetails(c.id)}
                  className="rounded bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
                >
                  Details & Logs
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
