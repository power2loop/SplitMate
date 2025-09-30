// components/modals/GroupSettingsModal.jsx
import { useEffect } from "react";

import "./GroupSettingsModal.css";

export default function GroupSettingsModal({
  open,
  onClose,
  groupMeta, // { name, created, membersCount, totalExpenses, createdByUsername }
  onDeleteGroup,
  onLeaveGroup,
}) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && open && onClose();
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const onBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onBackdrop}>
      <div
        className="modal-dialog settings"
        role="dialog"
        aria-modal="true"
        aria-labelledby="group-settings-title"
      >
        <div className="modal-header">
          <h3 id="group-settings-title">Group Settings</h3>
          <button className="close-btn" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="info-card">
            <h4>Group Information</h4>
            <div className="row">
              <span>Name:</span>
              <span>{groupMeta?.name || ""}</span>
            </div>
            <div className="row">
              <span>Members:</span>
              <span>{groupMeta?.membersCount ?? 0}</span>
            </div>
            <div className="row">
              <span>Total Expenses:</span>
              <span>{groupMeta?.totalExpenses ?? 0}</span>
            </div>
            <div className="row">
              <span>Created:</span>
              <span>{groupMeta?.created || ""}</span>
            </div>
            <div className="row">
              <span>Created By:</span>
              <span>{groupMeta?.createdByUsername || "—"}</span>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="danger" onClick={onDeleteGroup}>
            Delete Group
          </button>

          <button className="danger" onClick={onLeaveGroup}>
            Leave Group
          </button>
        </div>
      </div>
    </div>
  );
}
