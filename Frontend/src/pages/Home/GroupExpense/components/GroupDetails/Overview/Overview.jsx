// src/pages/.../GroupExpense/components/GroupDetails/Overview/Overview.jsx
import { useStore } from "@/Context/StoreContext";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Loader from "../../../../../../components/Loader/Loader.jsx";
import { api } from "../../../../../../services/api.js";
import AddExpenseModal from "../../modals/AddExpenseModal";
import GroupSettingsModal from "../../modals/GroupSettingsModal";
import Analytics from "../Analystic/Analystic";
import AllExpenses from "../Expense/AllExpense";

import "./Overview.css";

import { BsFillPersonPlusFill } from "react-icons/bs";
import { FaArrowLeft, FaMoneyBillAlt } from "react-icons/fa";
import { IoMdAddCircle } from "react-icons/io";
import { IoBarChart, IoHome, IoSettings, IoMenu, IoClose } from "react-icons/io5";

const Overview = () => {
  const navigate = useNavigate();
  const { groupId: routeGroupId } = useParams(); // e.g., /details/:groupId
  const { user } = useStore() || {};

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

  // Mobile hamburger menu state
  const [menuOpen, setMenuOpen] = useState(false);

  // For optimistic update of AllExpenses without refetch
  const [lastCreated, setLastCreated] = useState(null);

  const id = routeGroupId; // ObjectId or invite code

  // Fetch group details
  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        setLoading(true);
        const data = await api(`/groups/${id}`);
        if (!alive) return;

        // optional simulated delay
        setTimeout(() => {
          if (!alive) return;
          setGroup(data);
          setErr("");
          setLoading(false);
        }, 1000);
      } catch (e) {
        if (!alive) return;
        setErr(e.message || "Failed to load group");
        setLoading(false);
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
    _id: groupDocId,
  } = group || {};

  const totals = useMemo(() => {
    const totalExpenses = Array.isArray(expenses)
      ? expenses.reduce((s, e) => s + (Number(e?.amount) || 0), 0)
      : 0;
    return { expenses: totalExpenses, members: members?.length || 0 };
  }, [expenses, members]);

  const totalExpenses = totals.expenses;
  const totalMembers = totals.members;

  // Ownership checks (adjust per auth implementation)
  const currentUserId = group?.currentUserId || user?.id || user?._id || "";
  const ownerId = createdBy?._id?.toString?.() || createdBy?.toString?.() || "";
  const isOwner = ownerId && currentUserId && ownerId === currentUserId;

  // Invite modal handlers
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
      } catch { }
    } else {
      copyCode();
    }
  };

  // Add expense callback: receives server-created expense from AddExpenseModal
  const onAddExpense = (serverExpense) => {
    setGroup((prev) => {
      if (!prev) return prev;
      const nextExpenses = Array.isArray(prev.expenses)
        ? [serverExpense, ...prev.expenses]
        : [serverExpense];
      return { ...prev, expenses: nextExpenses };
    });

    setLastCreated(serverExpense);
    setActiveTab("expenses");
    setAddOpen(false);
  };

  const onDeleteGroup = async () => {
    try {
      await api(`/groups/${groupDocId}`, { method: "DELETE" });
      navigate("/groupexpense", { replace: true });
    } catch (e) {
      alert(e.message);
    }
  };

  const onLeaveGroup = async () => {
    if (isOwner) {
      alert("Owner cannot leave; delete the group or transfer ownership first.");
      return;
    }
    try {
      await api(`/groups/${groupDocId}/leave`, { method: "POST" });
      navigate("/groupexpense", { replace: true });
    } catch (e) {
      alert(e.message);
    }
  };

  // Close mobile menu on Escape
  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  // Helper open handlers from menu items
  const openInviteFromMenu = () => {
    setMenuOpen(false);
    setInviteOpen(true);
  };
  const openSettingsFromMenu = () => {
    setMenuOpen(false);
    setSettingsOpen(true);
  };
  const openAddFromMenu = () => {
    setMenuOpen(false);
    setAddOpen(true);
  };

  if (loading) {
    return (
      <div className="goa-trip-container">
        <Loader />
      </div>
    );
  }

  if (!loading && err) {
    return (
      <div className="goa-trip-container">
        <div className="error">{err}</div>
      </div>
    );
  }

  if (!loading && !group) {
    return (
      <div className="goa-trip-container">
        <div className="error">Group not found</div>
      </div>
    );
  }

  return (
    <>
      <div className="goa-trip-container">
        <div className="header">
          <div className="header-left">
            <button
              onClick={() => navigate("/groupexpense")}
              className="back-btn"
              style={{ gap: "20px", fontSize: "30px" }}
            >
              <FaArrowLeft />
            </button>
            <div className="title-section">
              <h1>{title}</h1>
              <p>{description}</p>
            </div>
          </div>

          <div className="header-right">
            {/* Inline actions visible on larger screens */}
            <div className="action-buttons">
              <button
                className="invite-btn"
                style={{ display: "flex", alignItems: "center", gap: "2px", fontSize: "15px" }}
                onClick={handleInvite}
              >
                <BsFillPersonPlusFill />
                Invite
              </button>
              <button
                className="settings-btn"
                style={{ display: "flex", alignItems: "center", gap: "2px", fontSize: "15px" }}
                onClick={() => setSettingsOpen(true)}
              >
                <IoSettings />
                Settings
              </button>
              <button
                className="add-expense-btn"
                style={{ display: "flex", alignItems: "center", gap: "2px", fontSize: "15px" }}
                onClick={() => setAddOpen(true)}
              >
                <IoMdAddCircle />
                Add Expense
              </button>
            </div>

            {/* Hamburger button for small screens */}
            <button
              className="hamburger-btn"
              aria-label={menuOpen ? "Close actions menu" : "Open actions menu"}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              aria-controls="actions-menu"
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? <IoClose /> : <IoMenu />}
            </button>
          </div>
        </div>

        {/* Mobile actions menu */}
        {menuOpen && (
          <div
            className="hamburger-menu-backdrop"
            onClick={(e) => {
              if (e.target === e.currentTarget) setMenuOpen(false);
            }}
          >
            <div
              id="actions-menu"
              className="hamburger-menu"
              role="menu"
              aria-label="Actions"
            >
              <button
                className="hamburger-item"
                role="menuitem"
                onClick={openInviteFromMenu}
              >
                <BsFillPersonPlusFill />
                Invite
              </button>
              <button
                className="hamburger-item"
                role="menuitem"
                onClick={openSettingsFromMenu}
              >
                <IoSettings />
                Settings
              </button>
              <button
                className="hamburger-item"
                role="menuitem"
                onClick={openAddFromMenu}
              >
                <IoMdAddCircle />
                Add Expense
              </button>
            </div>
          </div>
        )}

        <div className="navigation-tabs" id="overview">
          <a
            href="#overview"
            className={`tab ${activeTab === "overview" ? "active" : ""}`}
            style={{ gap: "5px" }}
            onClick={() => setActiveTab("overview")}
          >
            <IoHome />
            Overview
          </a>
          <a
            href="#Analytics"
            className={`tab ${activeTab === "analytics" ? "active" : ""}`}
            style={{ gap: "5px" }}
            onClick={() => setActiveTab("analytics")}
          >
            <IoBarChart />
            Analytics
          </a>
          <a
            href="#expenses"
            className={`tab ${activeTab === "expenses" ? "active" : ""}`}
            style={{ gap: "5px" }}
            onClick={() => setActiveTab("expenses")}
          >
            <FaMoneyBillAlt />
            Expenses
          </a>
        </div>

        <div className="tab-content">
          {activeTab === "overview" && (
            <div className="content-grid">
              <div className="group-summary-card">
                <h3>Group Details</h3>
                <div className="summary-item">
                  <span>Total Expenses</span>
                  <span className="amount">₹{Number(totalExpenses).toLocaleString()}</span>
                </div>
                <div className="summary-item">
                  <span>Members</span>
                  <span className="count">{totalMembers}</span>
                </div>
                <div className="summary-item">
                  <span>Created By</span>
                  <span className="detail">{createdBy?.username}</span>
                </div>
                <div className="summary-item">
                  <span>Date of Creation</span>
                  <span className="detail">
                    {new Date(group.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </span>
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
                      <div className="member-avatar" style={{ backgroundColor: m.color || "#4aa" }}>
                        {(m.username || m.email || "?").slice(0, 2).toUpperCase()}
                      </div>
                      <div className="member-info">
                        <div className="member-name">{m.username || m.name || "Member"}</div>
                        <div className="member-email">{m.email || ""}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "analytics" && <Analytics groupId={id} />}

          {activeTab === "expenses" && (
            <AllExpenses groupId={id} members={members || []} lastCreated={lastCreated} />
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
              <button className="close-btn" onClick={closeInvite} aria-label="Close">
                ×
              </button>
            </div>

            <p className="invite-sub">Share this invite code with your friends:</p>

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
        groupId={id}
        mode="group"
        onAdd={onAddExpense}
      />

      {/* Group Settings Modal */}
      <GroupSettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        isOwner={isOwner}
        groupMeta={{
          name: group?.name || "",
          created: group?.createdAt ? new Date(group.createdAt).toLocaleDateString() : "",
          membersCount: group?.members?.length || 0,
          totalExpenses: totals.expenses,
          createdByUsername: group?.createdBy?.username || "—",
        }}
        onDeleteGroup={onDeleteGroup}
        onLeaveGroup={onLeaveGroup}
      />
    </>
  );
};

export default Overview;
