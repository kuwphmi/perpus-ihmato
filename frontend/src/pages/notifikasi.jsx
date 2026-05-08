import { useEffect, useState } from "react";
import axios from "axios";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/notifications/${user.id}`
      );

      setNotifications(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <h1 className="text-2xl font-bold mb-5">
        Notifikasi
      </h1>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="bg-white p-4 rounded-xl">
            Belum ada notifikasi
          </div>
        ) : (
          notifications.map((item) => (
            <div
              key={item.id}
              className="bg-white p-4 rounded-xl shadow"
            >
              <h2 className="font-semibold">
                {item.title}
              </h2>

              <p className="text-gray-600 text-sm mt-1">
                {item.message}
              </p>

              <p className="text-xs text-gray-400 mt-2">
                {new Date(item.created_at).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}