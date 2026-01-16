import React from "react";
import { useAuth } from "@/context/AuthContext";
import { NotificationsProvider } from "@/features/notifications/context/NotificationsContext";
import { useNotifications } from "@/features/notifications/hooks/useNotifications";

export default function NotificationsRootProvider({ children }) {
  const { isAuthenticated } = useAuth();

  const notif = useNotifications({ enabled: isAuthenticated, limit: 6 });

  return <NotificationsProvider value={notif}>{children}</NotificationsProvider>;
}
