import React from "react";

type SettingsProps = {
  user?: {
    name: string;
    username: string;
    email: string;
    createdAt: string;
  };
};

export default function SettingsTab({
  user = {
    name: "John Doe",
    username: "johndoe",
    email: "john@example.com",
    createdAt: "2025-01-15",
  },
}: SettingsProps) {
  return (
    <section className="max-w-2xl">
      <h4 className="mb-4 text-lg font-medium">User Profile</h4>
      <div className="rounded border p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            value={user.name}
            readOnly
            className="w-full rounded border px-3 py-2 bg-zinc-100 dark:bg-zinc-800 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Username</label>
          <input
            type="text"
            value={user.username}
            readOnly
            className="w-full rounded border px-3 py-2 bg-zinc-100 dark:bg-zinc-800 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={user.email}
            readOnly
            className="w-full rounded border px-3 py-2 bg-zinc-100 dark:bg-zinc-800 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Member Since</label>
          <input
            type="text"
            value={user.createdAt}
            readOnly
            className="w-full rounded border px-3 py-2 bg-zinc-100 dark:bg-zinc-800 text-sm"
          />
        </div>
        <button className="w-full rounded bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 transition mt-6">
          Edit Profile
        </button>
      </div>
    </section>
  );
}
