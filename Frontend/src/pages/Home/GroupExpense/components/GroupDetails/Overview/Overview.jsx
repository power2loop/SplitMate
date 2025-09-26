import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Overview.css";
import Analytics from "../Analystic/Analystic";
import AllExpenses from "../Expense/AllExpense";
import AddExpenseModal from "../../modals/AddExpenseModal";
import GroupSettingsModal from "../../modals/GroupSettingsModal";
import { api } from "../../../../../../services/api.js";

const Overview = () => {
  const navigate = useNavigate();
  const { groupId: routeGroupId } = useParams();

  // Core state loaded from API
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // UI state
  const [activeTab, setActiveTab] = useState("overview");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const id = routeGroupId; // required for API calls

  // Fetch group details
  useEffect(() => {
    let alive = true;
    async function load() {
      try {
        setLoading(true);
        const data = await api(`/groups/${id}`);
        if (!alive) return;
        setGroup(data);
        setErr("");
      } catch (e) {
        if (!alive) return;
        setErr(e.message || "Failed to load group");
      } finally {
        if (alive) setLoading(false);
      }
    }
    if (id) load();
    return () => {
      alive = false;
    };
  }, [id]);

  // Derived UI fields with fallbacks
  const {
    name: title = "",
    description = "",
    inviteCode = "",
    members = [],
    expenses = [],
    createdBy,
    _id: groupId,
  } = group || {};

  const totals = useMemo(() => {
    const totalExpenses = Array.isArray(expenses)
      ? expenses.reduce((s, e) => s + (Number(e?.amount) || 0), 0)
      : 0;
    return { expenses: totalExpenses, members: members?.length || 0 };
  }, [expenses, members]);

  const totalExpenses = totals.expenses;
  const totalMembers = totals.members;

  // Determine ownership (requires current user id from auth-protected API or context)
  // If backend returns req.user in a /me endpoint, prefer that; placeholder below expects creator id on group
  const currentUserId = group?.currentUserId || ""; // set from auth store if available
  const ownerId = createdBy?._id?.toString?.() || createdBy?.toString?.() || "";
  const isOwner = ownerId && currentUserId && ownerId === currentUserId;

  // Invite modal
  const handleInvite = () => setInviteOpen(true);
  const closeInvite = () => {
    setInviteOpen(false);
    setCopied(false);
  };
  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(inviteCode || "");
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };
  const shareCode = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Group Invite",
          text: `Join group with code: ${inviteCode}`,
          url: window.location.href,
        });
      } catch {}
    } else {
      copyCode();
    }
  };

  // Actions
  const onAddExpense = async (payload) => {
    // hit backend: POST /api/expenses with groupId
    // await api(`/expenses`, { method: "POST", body: JSON.stringify({ ...payload, groupId }) });
    // refresh group details
  };

  const onDeleteGroup = async () => {
    try {
      await api(`/groups/${groupId}`, { method: "DELETE" });
      navigate("/groupexpense", { replace: true });
    } catch (e) {
      alert(e.message);
    }
  };

  const onLeaveGroup = async () => {
    if (isOwner) {
      alert(
        "Owner cannot leave; delete the group or transfer ownership first."
      );
      return;
    }
    try {
      await api(`/groups/${groupId}/leave`, { method: "POST" });
      navigate("/groupexpense", { replace: true });
    } catch (e) {
      alert(e.message);
    }
  };

  if (loading) {
    return (
      <div className="goa-trip-container">
        <div className="loading">Loading group…</div>
      </div>
    ); // [web:259][web:261]
  }
  if (err) {
    return (
      <div className="goa-trip-container">
        <div className="error">{err}</div>
      </div>
    ); // [web:259][web:261]
  }
  if (!group) {
    return (
      <div className="goa-trip-container">
        <div className="error">Group not found</div>
      </div>
    ); // [web:259][web:261]
  }

  return (
    <>
      <div className="goa-trip-container">
        <div className="header">
          <div className="header-left">
            <button
              onClick={() => navigate("/groupexpense")}
              className="back-btn"
            >
              ←
            </button>
            <div className="title-section">
              <h1>{title}</h1>
              <p>{description}</p>
            </div>
          </div>
          <div className="header-right">
            <button className="invite-btn" onClick={handleInvite}>
              👥 Invite
            </button>
            <button
              className="settings-btn"
              onClick={() => setSettingsOpen(true)}
            >
              ⚙️ Settings
            </button>
            <button
              className="add-expense-btn"
              onClick={() => setAddOpen(true)}
            >
              + Add Expense
            </button>
          </div>
        </div>

        <div className="navigation-tabs" id="overview">
          <a
            href="#overview"
            className={`tab ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            🏠 Overview
          </a>
          <a
            href="#Analytics"
            className={`tab ${activeTab === "analytics" ? "active" : ""}`}
            onClick={() => setActiveTab("analytics")}
          >
            📊 Analytics
          </a>
          <a
            href="#expenses"
            className={`tab ${activeTab === "expenses" ? "active" : ""}`}
            onClick={() => setActiveTab("expenses")}
          >
            💰 Expenses
          </a>
        </div>

        <div className="tab-content">
          {activeTab === "overview" && (
            <div className="content-grid">
              <div className="group-summary-card">
                <h3>Group Details</h3>
                <div className="summary-item">
                  <span>Total Expenses</span>
                  <span className="amount">
                    ₹{Number(totalExpenses).toLocaleString()}
                  </span>
                </div>
                <div className="summary-item">
                  <span>Members</span>
                  <span className="count">{totalMembers}</span>
                </div>
                <div className="summary-item">
                  <span>Invite Code</span>
                  <span className="invite-code">{inviteCode || "—"}</span>
                </div>
              </div>

              <div className="member-balances-card">
                <h3>Member Lists</h3>
                <div className="members-list">
                  {(members || []).map((m) => (
                    <div
                      key={(m._id || m.id || m.email || m.username)?.toString()}
                      className="member-item"
                    >
                      <div
                        className="member-avatar"
                        style={{ backgroundColor: m.color || "#4aa" }}
                      >
                        {(m.username || m.email || "?")
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>
                      <div className="member-info">
                        <div className="member-name">
                          {m.username || m.name || "Member"}
                        </div>
                        <div className="member-email">{m.email || ""}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "analytics" && <Analytics group={group} />}

          {activeTab === "expenses" && (
            <AllExpenses expenses={expenses || []} />
          )}
        </div>
      </div>

      {/* Invite Modal */}
      {inviteOpen && (
        <div
          className="invite-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeInvite();
          }}
        >
          <div
            className="invite-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="invite-title"
          >
            <div className="invite-header">
              <h3 id="invite-title">Invite Members</h3>
              <button
                className="close-btn"
                onClick={closeInvite}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <p className="invite-sub">
              Share this invite code with your friends:
            </p>

            <div className="code-box">
              <span className="code-text">{inviteCode || "—"}</span>
            </div>

            <div className="actions">
              <button className="copy-btn" onClick={copyCode}>
                {copied ? "Copied!" : "Copy Invite Code"}
              </button>
              <button className="share-btn" onClick={shareCode}>
                Share
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Expense Modal */}
      <AddExpenseModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        members={members || []}
        onAddExpense={onAddExpense}
        onAdd={onAddExpense}
      />

      {/* Group Settings Modal */}
      <GroupSettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        isOwner={isOwner}
        groupMeta={{
          name: group?.name || "",
          created: group?.createdAt
            ? new Date(group.createdAt).toLocaleDateString()
            : "",
          membersCount: group?.members?.length || 0,
          totalExpenses: totals.expenses,
          createdByUsername: group?.createdBy?.username || "—", // populated field
        }}
        onDeleteGroup={onDeleteGroup}
        onLeaveGroup={onLeaveGroup}
      />
    </>
  );
};

export default Overview;
