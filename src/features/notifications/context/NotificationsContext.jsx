import React, { createContext, useContext } from "react";

const NotificationsContext = createContext(null);

export function NotificationsProvider({ value, children }) {
  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotificationsState() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) {
    throw new Error("useNotificationsState must be used within <NotificationsRootProvider />");
  }
  return ctx;
}
