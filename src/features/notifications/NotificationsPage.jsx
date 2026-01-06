// src/features/notifications/pages/NotificationsPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import PageLayout from "@/components/common/PageLayout";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

import { useNotificationsState } from "@/features/notifications/context/NotificationsContext";

import "./styles/NotificationsPage.css";

function formatRelative(dateLike) {
  if (!dateLike) return "";
  const d = new Date(dateLike);
  if (Number.isNaN(d.getTime())) return String(dateLike);

  const diff = Date.now() - d.getTime();
  const sec = Math.floor(diff / 1000);
  const min = Math.floor(sec / 60);
  const hr = Math.floor(min / 60);
  const day = Math.floor(hr / 24);

  if (sec < 45) return "just now";
  if (min < 60) return `${min}m ago`;
  if (hr < 24) return `${hr}h ago`;
  if (day < 7) return `${day}d ago`;

  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export default function NotificationsPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState("all"); // all | unread

  const { items, loading, unreadCount, markAllRead, markRead, loadWithLimit } =
    useNotificationsState();

  useEffect(() => {
    if (isAuthenticated) {
      loadWithLimit?.(50);
    }
  }, [isAuthenticated, loadWithLimit]);

  const filtered = useMemo(() => {
    if (tab === "unread") return items.filter((x) => !x.read);
    return items;
  }, [items, tab]);

  const openNotification = async (n) => {
    const link = (n?.link ?? "").trim();
    if (!link) return;

    try {
      if (!n.read && typeof markRead === "function") {
        await markRead(n.id);
      }
    } catch {
    }


    if (/^https?:\/\//i.test(link)) {
      window.location.href = link;
      return;
    }

    navigate(link.startsWith("/") ? link : `/${link}`);
  };

  return (
    <PageLayout title="Notifications">
      {!isAuthenticated ? (
        <div className="np-empty">
          <div className="np-emptyCard">
            <div className="np-emptyIcon">🔒</div>
            <div className="np-emptyTitle">Please sign in</div>
            <div className="np-emptyText">Notifications are available after authentication.</div>
          </div>
        </div>
      ) : (
        <div className="np">
          {/* header */}
          <div className="np-top">
            <div className="np-tabs">
              <button
                className={"np-tab " + (tab === "all" ? "is-active" : "")}
                onClick={() => setTab("all")}
                type="button"
              >
                All
              </button>

              <button
                className={"np-tab " + (tab === "unread" ? "is-active" : "")}
                onClick={() => setTab("unread")}
                type="button"
              >
                Unread
                {unreadCount > 0 && <span className="np-badge">{unreadCount}</span>}
              </button>
            </div>

            <div className="np-actions">
              {unreadCount > 0 && (
                <button className="np-actionBtn" onClick={markAllRead} type="button">
                  Mark all read
                </button>
              )}
            </div>
          </div>

          {/* body */}
          {loading ? (
            <div className="np-loading">
              <div className="np-spinner" />
              <div className="np-loadingText">Loading notifications…</div>
            </div>
          ) : filtered.length ? (
            <div className="np-list">
              {filtered.map((n) => {
                const hasLink = Boolean((n.link ?? "").trim());

                return (
                  <div
                    key={n.id}
                    className={
                      "np-item " +
                      (!n.read ? "is-unread" : "") +
                      (!hasLink ? " is-disabled" : "")
                    }
                    role={hasLink ? "button" : undefined}
                    tabIndex={hasLink ? 0 : -1}
                    style={{ cursor: hasLink ? "pointer" : "default" }}
                    onClick={() => hasLink && openNotification(n)}
                    onKeyDown={(e) => {
                      if (!hasLink) return;
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        openNotification(n);
                      }
                    }}
                    title={hasLink ? "Open" : "No link"}
                  >
                    <div className="np-itemHead">
                      <div className="np-titleRow">
                        {!n.read && <span className="np-dot" aria-hidden="true" />}
                        <div className="np-title">{n.title}</div>
                      </div>

                      <div className="np-meta">
                        <span className="np-time">{formatRelative(n.createdAt)}</span>
                      </div>
                    </div>

                    {n.body && <div className="np-body">{n.body}</div>}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="np-empty">
              <div className="np-emptyCard">
                <div className="np-emptyIcon">✨</div>
                <div className="np-emptyTitle">No notifications yet</div>
                <div className="np-emptyText">
                  When something happens, it will appear here.
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </PageLayout>
  );
}
