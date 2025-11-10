import React, { useState } from "react";

export default function SettingsTab() {
  const [port, setPort] = useState("8080");

  return (
    <section className="max-w-3xl">
      {/* Self-Hosting Configuration */}
      <div>
        <h4 className="mb-4 text-lg font-medium">Self-Hosting Configuration</h4>
        <div className="rounded border p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Domain</label>
            <div className="p-3 rounded bg-blue-50 dark:bg-blue-900/20 text-sm text-blue-900 dark:text-blue-100">
              Your instance will use a random domain generated for this self-hosted deployment.
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Port</label>
            <input
              type="number"
              value={port}
              onChange={(e) => setPort(e.target.value)}
              className="w-full rounded border px-3 py-2 bg-white dark:bg-zinc-800 text-sm"
            />
            <p className="text-xs text-zinc-500 mt-1">Default: 8080</p>
          </div>

          <button className="w-full rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition mt-6">
            Save Configuration
          </button>
        </div>
      </div>
    </section>
  );
}
