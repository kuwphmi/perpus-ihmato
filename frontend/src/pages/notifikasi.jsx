import { useEffect, useState } from "react";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

export default function Notifikasi() {
  const [notifications, setNotifications] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch(
        `${API_BASE}/notifications/${user.id}`
      );

      const data = await res.json();

      setNotifications(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <h1 className="mb-6 text-2xl font-bold text-blue-900">
        Notifikasi
      </h1>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="rounded-2xl bg-white p-6 shadow">
            Belum ada notifikasi.
          </div>
        ) : (
          notifications.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl bg-white p-5 shadow"
            >
              <div className="font-semibold text-slate-800">
                {item.title}
              </div>

              <div className="mt-1 text-sm text-slate-600">
                {item.message}
              </div>

              <div className="mt-2 text-xs text-slate-400">
                {new Date(item.created_at).toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}