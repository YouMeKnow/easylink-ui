import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";
import { trackEvent } from "@/services/amplitude";
import { useNotificationsState } from "@/features/notifications/context/NotificationsContext";

import "@/features/notifications/styles/NotificationBell.css";

export default function NotificationBell() {
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation("header");
  const navigate = useNavigate();

  const {
    items,
    open,
    toggle,
    wrapRef,
    unreadCount,
    loading,
    error,
    markRead,
    markAllRead,
    setOpen,
  } = useNotificationsState();

  const openAll = () => {
    trackEvent("Header Notifications View All");
    setOpen(false);
    navigate("/notifications");
  };

  const openOne = async (n) => {
    trackEvent("Notification Clicked", { id: n.id, title: n.title });
    setOpen(false);
    await markRead(n.id);
    if (n.link) navigate(n.link);
  };

  if (!isAuthenticated) return null;

  return (
    <div className={"topbar__notifWrap " + (open ? "is-open" : "")} ref={wrapRef}>
      <button
        className="topbar__iconBtn topbar__notifBtn"
        onClick={() => {
          trackEvent("Header Notifications Toggled", { open: !open });
          toggle();
        }}
        aria-label={t("notifications", { defaultValue: "Notifications" })}
        title={t("notifications", { defaultValue: "Notifications" })}
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        <span className="topbar__icon" aria-hidden="true">🔔</span>

        {unreadCount > 0 && (
          <span className="topbar__badge" aria-label={`${unreadCount} unread`}>
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="notifPop" role="dialog" aria-label="Notifications">
          <div className="notifPop__header">
            <div className="notifPop__title">
              {t("notifications", { defaultValue: "Notifications" })}
              {unreadCount > 0 && (
                <span className="notifPop__pill">{unreadCount} new</span>
              )}
            </div>

            <div className="notifPop__actions">
              <button className="notifPop__allBtn" onClick={openAll} type="button">
                {t("view_all", { defaultValue: "View all" })}
              </button>
            </div>
          </div>

          <div className="notifPop__list">
            {loading && <SkeletonList />}

            {!loading && error && (
              <div className="notifPop__state">
                <div className="notifPop__stateTitle">Couldn’t load notifications</div>
                <div className="notifPop__stateText">Check your connection and try again.</div>
                <button
                  className="notifPop__primary"
                  onClick={() => {
                    // если есть refetch() — используй его
                    // refetch?.();
                    toggle(); // fallback
                    toggle();
                  }}
                  type="button"
                >
                  Retry
                </button>
              </div>
            )}

            {!loading && !error && items.length === 0 && (
              <div className="notifPop__empty">
                <div className="notifPop__emptyIcon">✨</div>
                <div className="notifPop__emptyTitle">
                  {t("no_notifications", { defaultValue: "No notifications yet" })}
                </div>
                <div className="notifPop__emptyText">
                  You’ll see updates here when something happens.
                </div>
              </div>
            )}

            {!loading && !error && items.slice(0, 6).map((n) => (
              <button
                key={n.id}
                className={"notifItem " + (n.read ? "" : "notifItem--unread")}
                onClick={() => openOne(n)}
                type="button"
              >
                <div className="notifItem__top">
                  <div className="notifItem__title" title={n.title}>
                    {!n.read && <span className="notifItem__dot" aria-hidden="true" />}
                    <span className="notifItem__titleText">{n.title}</span>
                  </div>
                  <div className="notifItem__time">{formatRelative(n.createdAt)}</div>
                </div>
                {n.body && <div className="notifItem__body">{n.body}</div>}
              </button>
            ))}
          </div>

          <div className="notifPop__footer">
            <button
              className="notifPop__footerBtn"
              onClick={async () => {
                await markAllRead();
              }}
              type="button"
              disabled={unreadCount === 0}
              title={unreadCount === 0 ? "No unread notifications" : undefined}
            >
              {t("mark_all_read", { defaultValue: "Mark all read" })}
            </button>
          </div>

        </div>
      )}
    </div>
  );
}

function SkeletonList() {
  return (
    <div className="notifSkel">
      {Array.from({ length: 5 }).map((_, i) => (
        <div className="notifSkel__row" key={i}>
          <div className="notifSkel__top">
            <div className="notifSkel__line notifSkel__line--title" />
            <div className="notifSkel__line notifSkel__line--time" />
          </div>
          <div className="notifSkel__line notifSkel__line--body" />
        </div>
      ))}
    </div>
  );
}

function formatRelative(createdAt) {
  if (!createdAt) return "";
  const d = new Date(createdAt);
  if (Number.isNaN(d.getTime())) return String(createdAt);

  const diff = Date.now() - d.getTime();
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return "now";
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h`;
  const days = Math.floor(hr / 24);
  return `${days}d`;
}
