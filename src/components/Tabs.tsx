"use client";
import React, { useEffect, useState } from "react";
import Modal from "./Modal";

type Container = {
  id: string;
  name: string;
  image: string;
  status: "initializing" | "running" | "stopped";
  logs: string[];
  createdAt: number;
};

const TABS = ["Home", "Pods", "Images", "Settings"];

function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

export default function Tabs() {
  const [active, setActive] = useState<number>(0);
  const [containers, setContainers] = useState<Container[]>([]);
  const [openContainerId, setOpenContainerId] = useState<string | null>(null);

  function createContainer() {
    const id = generateId();
    const newC: Container = {
      id,
      name: `container-${id}`,
      image: "alpine:latest",
      status: "initializing",
      logs: ["[init] creating container..."],
      createdAt: Date.now(),
    };

    setContainers((s) => [newC, ...s]);
    setOpenContainerId(id);

    // simulate logs and status updates
    setTimeout(() => {
      setContainers((s) =>
        s.map((c) =>
          c.id === id
            ? { ...c, logs: [...c.logs, "[init] pulling image", "[init] starting..."], status: "running" }
            : c
        )
      );
    }, 1200);

    setTimeout(() => {
      setContainers((s) =>
        s.map((c) => (c.id === id ? { ...c, logs: [...c.logs, "[info] container running"] } : c))
      );
    }, 2200);
  }

  const running = containers.filter((c) => c.status !== "stopped");

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-black dark:text-white p-6">
      <div className="mx-auto max-w-5xl">
        <header className="flex items-center justify-between border-b pb-4">
          <nav className="flex items-center gap-4">
            {TABS.map((t, i) => (
              <button
                key={t}
                onClick={() => setActive(i)}
                className={`rounded px-3 py-2 text-sm ${i === active ? "border-b-2 font-semibold" : "opacity-80"}`}
              >
                {t}
              </button>
            ))}
          </nav>
        </header>

        <div className="mt-4">
          <div className="flex justify-end mb-4">
            {active === 0 && (
              <button onClick={createContainer} className="rounded bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700">
                Create New Container
              </button>
            )}
          </div>

          <main>
            {active === 0 && (
              <section>
                <h4 className="mb-2 text-lg font-medium">Running Containers</h4>
                <div className="space-y-3">
                  {running.length === 0 && <div className="text-sm text-zinc-600">No running containers</div>}
                  {running.map((c) => (
                    <div key={c.id} className="flex items-center justify-between rounded border p-3">
                      <div className="flex items-center gap-3">
                        <span
                          className={`inline-block h-2 w-2 rounded-full ${
                            c.status === "running" ? "bg-green-500" : c.status === "initializing" ? "bg-yellow-400" : "bg-gray-400"
                          }`}
                        />
                        <div>
                          <div className="font-medium">{c.name}</div>
                          <div className="text-sm text-zinc-600 dark:text-zinc-400">{c.image}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => setOpenContainerId(c.id)} className="rounded border px-2 py-1 text-sm">
                          View Logs
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <h4 className="mb-2 text-lg font-medium">Recent Containers</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {containers.slice(0, 5).map((c) => (
                      <div key={c.id} className="rounded border p-2 text-sm">
                        <div className="flex items-center justify-between">
                          <div>{c.name}</div>
                          <div className="text-zinc-500 text-sm">{c.status}</div>
                        </div>
                      </div>
                    ))}
                    {containers.length === 0 && <div className="text-sm text-zinc-600">No recent containers</div>}
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="mb-2 text-lg font-medium">Recent Images</h4>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                    {Array.from(new Set(containers.map((c) => c.image))).slice(0, 8).map((img) => (
                      <div key={img} className="rounded border p-2 text-sm">
                        {img}
                      </div>
                    ))}
                    {containers.length === 0 && <div className="text-sm text-zinc-600">No recent images</div>}
                  </div>
                </div>
              </section>
            )}

            {active === 1 && <div className="p-6">Pods / Services placeholder (will be wired to backend)</div>}
            {active === 2 && <div className="p-6">Images placeholder (list and actions)</div>}
            {active === 3 && <div className="p-6">Settings placeholder</div>}
          </main>
        </div>
      </div>

      <Modal
        open={!!openContainerId}
        onClose={() => setOpenContainerId(null)}
        title={openContainerId ? `${containers.find((c) => c.id === openContainerId)?.name ?? "Container"} Logs` : "Logs"}
      >
        <div className="max-h-72 overflow-auto bg-black/5 p-3 rounded text-sm font-mono dark:bg-white/5 dark:text-white">
          {openContainerId ? (
            containers
              .find((c) => c.id === openContainerId)
              ?.logs.map((l, i) => (
                <div key={i} className="whitespace-pre-wrap">
                  {l}
                </div>
              ))
          ) : (
            <div>No logs</div>
          )}
        </div>
      </Modal>
    </div>
  );
}
