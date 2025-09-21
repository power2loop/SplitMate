// Overview.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Overview.css';
import Analytics from '../Analystic/Analystic';
import AllExpenses from '../Expense/AllExpense';

// NOTE: keep these imports pointing to where your files actually live
import AddExpenseModal from '../../modals/AddExpenseModal';
import GroupSettingsModal from '../../modals/GroupSettingsModal';

// Demo data and utils
import { GOA_TRIP } from '../../../../../../data/goaTrip';
import { generateInviteCode } from '../../../../../../lib/inviteCode';

const Overview = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  // Data
  const {
    title,
    description,
    defaultInviteCode,
    totals,
    members,
    ownerId,
    currentUserId: currentId
  } = GOA_TRIP || {};
  const totalExpenses = totals?.expenses ?? 0;
  const totalMembers = totals?.members ?? (members?.length ?? 0);
  const memberBalances = members ?? [];

  // Ownership (use ONLY the persisted ownerId; no fallback to first member)
  const currentUserId = currentId || 'U1';
  const groupOwnerId = ownerId ?? null;
  const isOwner = groupOwnerId != null && currentUserId === groupOwnerId;

  // Invite modal
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteCode, setInviteCode] = useState(defaultInviteCode || 'GOA-123');
  const [copied, setCopied] = useState(false);

  // NEW: Modals state
  const [addOpen, setAddOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Tabs
  const handleTabChange = (tab) => setActiveTab(tab);

  // Buttons: log to confirm they fire
  const handleAddExpense = () => {
    console.log('[UI] Add Expense clicked');
    setAddOpen(true);
  };
  const handleSettings = () => {
    console.log('[UI] Settings clicked');
    setSettingsOpen(true);
  };

  // Invite handlers
  const handleInvite = () => setInviteOpen(true);
  const closeInvite = () => { setInviteOpen(false); setCopied(false); };
  const regenerate = () => setInviteCode(generateInviteCode('GOA', 3));
  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(inviteCode);
      setCopied(true);
    } catch (e) {
      console.error('Copy failed', e);
    }
  };
  const shareCode = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Group Invite',
          text: `Join our Goa Trip with code: ${inviteCode}`,
          url: window.location.href
        });
      } catch {/* cancelled */ }
    } else {
      copyCode();
    }
  };

  // ESC to close Invite
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') closeInvite(); };
    if (inviteOpen) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [inviteOpen]);

  // Add expense callback
  const onAddExpense = (expense) => {
    console.log('[DATA] New expense payload:', expense);
    // TODO: persist to storage/backend and refresh list
  };

  // Settings actions
  const onDeleteGroup = () => {
    console.log('[DATA] Delete group confirmed');
    navigate('/home/groupexpense');
  };
  const onLeaveGroup = () => {
    if (isOwner) {
      alert('Owner cannot leave; delete the group or transfer ownership first.');
      return;
    }
    console.log('[DATA] Leave group confirmed');
    navigate('/home/groupexpense');
  };

  return (
    <>
      <div className="goa-trip-container">
        <div className="header">
          <div className="header-left">
            <button onClick={() => navigate('/home/groupexpense')} className="back-btn">←</button>
            <div className="title-section">
              <h1>{title}</h1>
              <p>{description}</p>
            </div>
          </div>
          <div className="header-right">
            <button className="invite-btn" onClick={handleInvite}>👥 Invite</button>
            <button className="settings-btn" onClick={handleSettings}>⚙️ Settings</button>
            <button className="add-expense-btn" onClick={handleAddExpense}>+ Add Expense</button>
          </div>
        </div>

        <div className="navigation-tabs" id="overview">
          <a
            href="#overview"
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => handleTabChange('overview')}
          >
            🏠 Overview
          </a>
          <a
            href="#Analytics"
            className={`tab ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => handleTabChange('analytics')}
          >
            📊 Analytics
          </a>
          <a
            href="#expenses"
            className={`tab ${activeTab === 'expenses' ? 'active' : ''}`}
            onClick={() => handleTabChange('expenses')}
          >
            💰 Expenses
          </a>
        </div>

        <div className="content-grid">
          <div className="group-summary-card">
            <h3>Group Summary</h3>
            <div className="summary-item">
              <span>Total Expenses</span>
              <span className="amount">₹{Number(totalExpenses).toLocaleString()}</span>
            </div>
            <div className="summary-item">
              <span>Members</span>
              <span className="count">{totalMembers}</span>
            </div>
            <div className="summary-item">
              <span>Invite Code</span>
              <span className="invite-code">{inviteCode}</span>
            </div>
          </div>

          <div className="member-balances-card">
            <h3>Member Balances</h3>
            <div className="members-list">
              {memberBalances.map((member) => (
                <div key={member.id} className="member-item">
                  <div className="member-avatar" style={{ backgroundColor: member.color }}>
                    {member.id}
                  </div>
                  <div className="member-info">
                    <div className="member-name">{member.name}</div>
                    <div className="member-email">{member.email}</div>
                  </div>
                  <div className={`member-balance ${member.status}`}>
                    {member.status === 'gets' ? 'Gets' : 'Owes'} ₹{Number(member.balance).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* keep always visible for now */}
        <Analytics />
        <AllExpenses />
      </div>

      {/* Invite Modal */}
      {inviteOpen && (
        <div
          className="invite-backdrop"
          onClick={(e) => { if (e.target === e.currentTarget) closeInvite(); }}
        >
          <div className="invite-dialog" role="dialog" aria-modal="true" aria-labelledby="invite-title">
            <div className="invite-header">
              <h3 id="invite-title">Invite Members</h3>
              <button className="close-btn" onClick={closeInvite} aria-label="Close">×</button>
            </div>

            <p className="invite-sub">Share this invite code with your friends:</p>

            <div className="code-box">
              <span className="code-text">{inviteCode}</span>
              <button className="regen-btn" onClick={regenerate} title="Regenerate">↻</button>
            </div>

            <div className="actions">
              <button className="copy-btn" onClick={copyCode}>{copied ? 'Copied!' : 'Copy Invite Code'}</button>
              <button className="share-btn" onClick={shareCode}>Share</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Expense Modal */}
      <AddExpenseModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        members={memberBalances}
        onAddExpense={onAddExpense}
        /* extra compatibility prop if your modal expects onAdd */
        onAdd={onAddExpense}
      />

      {/* Group Settings Modal */}
      <GroupSettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        isOwner={isOwner}
        groupMeta={{
          name: title,
          created: 'Jan 10, 2024',
          membersCount: totalMembers,
          totalExpenses,
        }}
        onDeleteGroup={onDeleteGroup}
        onLeaveGroup={onLeaveGroup}
      />
    </>
  );
};

export default Overview;
