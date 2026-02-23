import React from "react";
import "./styles/ConfirmModal.css"

export default function ConfirmModal({
    open,
    title = "Confirm",
    message = "Are you sure?",
    confirmText = "Delete",
    cancelText = "Cancel",
    danger = true,
    onConfirm,
    onClose,
}) {
    React.useEffect(() => {
        if (!open) return;

        const onKeyDown = (e) => {
            if (e.key === "Escape") onClose?.();
            if (e.key === "Enter") onConfirm?.();
        };

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [open, onClose, onConfirm]);

    if (!open) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="confirm-backdrop"
                onClick={() => onClose?.()}
                aria-hidden="true"
            />

            {/* Dialog */}
            <div className="confirm-wrap" role="dialog" aria-modal="true">
                <div className="confirm-card">
                    <div className="confirm-head">
                        <div className="confirm-icon" aria-hidden="true">
                            !
                        </div>
                        <div className="confirm-titles">
                            <div className="confirm-title">{title}</div>
                            <div className="confirm-msg">{message}</div>
                        </div>
                    </div>

                    <div className="confirm-actions">
                        <button
                            type="button"
                            className="btn btn-light"
                            onClick={() => onClose?.()}
                        >
                            {cancelText}
                        </button>

                        <button
                            type="button"
                            className={`btn ${danger ? "btn-danger" : "btn-primary"}`}
                            onClick={() => onConfirm?.()}
                            autoFocus
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
