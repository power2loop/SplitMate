import { useEffect, useState } from 'react';
import {useNavigate} from 'react-router-dom';
import "./Overview.css";
import Navbars from '../../GE-Navbar/Navbar';
import Analytics from '../Analystic/Analystic';
import AllExpenses from '../Expense/AllExpense';

const randomCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s = 'GOA';
  for (let i = 0; i < 3; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
};

const Overview = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  // Invite modal state
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteCode, setInviteCode] = useState('GOA24X');
  const [copied, setCopied] = useState(false);

  // Demo data
  const memberBalances = [
    { id: 'Y',  name: 'You',         email: 'you@example.com',  balance: 8800, status: 'gets', color: '#4F46E5' },
    { id: 'JS', name: 'Jane Smith',  email: 'jane@example.com', balance: 2800, status: 'owes', color: '#10B981' },
    { id: 'MJ', name: 'Mike Johnson', email: 'mike@example.com', balance: 5000, status: 'owes', color: '#EF4444' }
  ];
  const totalExpenses = 18600;
  const totalMembers = 3;

  const handleTabChange = (tab) => setActiveTab(tab);
  const handleAddExpense = () => console.log('Add expense clicked');

  // Invite modal handlers
  const handleInvite = () => setInviteOpen(true);
  const closeInvite = () => { setInviteOpen(false); setCopied(false); };
  const regenerate = () => setInviteCode(randomCode());
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
      } catch {}
    } else {
      copyCode();
    }
  };

  // ESC to close modal
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') closeInvite(); };
    if (inviteOpen) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [inviteOpen]);

  return (
    <>
      <div className="goa-trip-container">
        <div className="header">
          <div className="header-left">
            <button onClick={() => navigate('/home/groupexpense')} className="back-btn">←</button>
            <div className="title-section">
              <h1>Goa Trip 2024</h1>
              <p>Beach vacation with friends</p>
            </div>
          </div>
          <div className="header-right">
            <button className="invite-btn" onClick={handleInvite}>👥 Invite</button>
            <button className="settings-btn">⚙️ Settings</button>
            <button className="add-expense-btn" onClick={handleAddExpense}>+ Add Expense</button>
          </div>
        </div>

        <div className="navigation-tabs" id='overview'>
          <a href='#overview'
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => handleTabChange('overview')}
          >
            🏠 Overview
          </a>
          <a href='#Analytics'
            className={`tab ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => handleTabChange('analytics')}
          >
            📊 Analytics
          </a>
          <a href='#expenses'
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
              <span className="amount">₹{totalExpenses.toLocaleString()}</span>
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
                    {member.status === 'gets' ? 'Gets' : 'Owes'} ₹{member.balance.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* {activeTab === 'analytics' && <Analytics/>}
        {activeTab === 'expenses' && <AllExpenses/>}
        {activeTab === 'overview' && ({})} */}
        <Analytics/>
        <AllExpenses/>
      </div>


      {/* Inline Invite Modal */}
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
    </>
  );
};

export default Overview;
