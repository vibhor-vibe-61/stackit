import { useEffect, useRef, useState } from "react";
import { FaBell } from "react-icons/fa";
import socket from "../sockets/socket";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    // Mock: load initial notifications
    setNotifications([
      { id: 1, text: "Someone answered your question", read: false },
      { id: 2, text: "You were mentioned in an answer", read: false },
    ]);

    // Socket listener for new notifications
    socket.on("new-notification", (notif) => {
      setNotifications((prev) => [notif, ...prev]);
    });

    // Close dropdown on outside click
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setShowDropdown(!showDropdown)} className="relative">
        <FaBell className="text-xl" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5">
            {unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded z-50 p-2">
          <h4 className="font-semibold text-sm mb-2">Notifications</h4>
          {notifications.length === 0 ? (
            <p className="text-sm text-gray-500">No new notifications</p>
          ) : (
            notifications.map((notif) => (
              <div key={notif.id} className="text-sm text-gray-700 p-2 hover:bg-gray-100 rounded">
                {notif.text}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
