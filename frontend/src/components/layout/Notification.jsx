import { useEffect, useState } from "react";
import { Cake, Heart } from "lucide-react";
import { api } from "../../lib/axios.js";

export default function Notification() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/doctors/getUpcomingEvents");
      console.log(data);

      setEvents(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const getLabel = (days) => {
    if (days === 0) return "Today";
    if (days === 1) return "Tomorrow";
    return `In ${days} days`;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 w-full">
      <h2 className="text-xl sm:text-2xl font-bold mb-5">
        🎉 Upcoming Celebrations
      </h2>

      {loading && <p className="text-gray-500">Loading...</p>}

      {!loading && events.length === 0 && (
        <div className="text-gray-500 text-center py-5">
          No upcoming birthdays or anniversaries.
        </div>
      )}

      <div className="space-y-3">
        {events.map((event) => (
          <div
            key={event.id}
            className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 border rounded-xl p-3 sm:p-4 hover:bg-gray-50 transition"
          >
            <div className="flex items-center gap-3 min-w-0">
              {event.type === "birthday" ? (
                <Cake className="text-pink-500 flex-shrink-0" />
              ) : (
                <Heart className="text-red-500 flex-shrink-0" />
              )}

              <div className="min-w-0">
                <h3 className="font-semibold text-base sm:text-lg break-words">
                  {event.name}
                </h3>

                <p className="text-xs sm:text-sm text-gray-500">
                  {event.type === "birthday"
                    ? "Birthday"
                    : "Marriage Anniversary"}
                </p>
              </div>
            </div>

            <div>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${
                  event.daysLeft === 0
                    ? "bg-green-100 text-green-700"
                    : event.daysLeft === 1
                      ? "bg-blue-100 text-blue-700"
                      : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {getLabel(event.daysLeft)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
