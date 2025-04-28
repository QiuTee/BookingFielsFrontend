
import { createContext, useContext, useState } from "react";
import Notification from "../common/Notification";
import { v4 as uuidv4 } from "uuid";
export const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const showNotification = ({ type = "info", message, duration = 5000 }) => {
    const id = uuidv4();
    setNotifications((prev) => [...prev, { id, type, message }]);

    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, duration);
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <div className="fixed top-4 right-4 space-y-3 z-[9999]">
        {notifications.map((n) => (
          <Notification key={n.id} {...n} onClose={() => removeNotification(n.id)} />
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

export const useNotification = () => useContext(NotificationContext);
