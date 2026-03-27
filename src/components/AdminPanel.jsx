import { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Shield, Users, MessageSquare, Activity, Clock, AlertTriangle,
  CheckCircle2, XCircle, Eye, FileText, ListFilter, Search,
  ChevronDown, Lock, Unlock, UserX, Bell, BarChart2, Settings
} from 'lucide-react';

const TABS = ['Overview', 'Users', 'Audit Log', 'Grievances'];

function UserRow({ user, onAction }) {
  const roleColors = {
    Admin: 'tag-red',
    Faculty: 'tag-blue',
    Student: 'text-text-muted bg-surface-hover text-xs font-medium px-2 py-0.5 rounded-md',
  };
  const statusColors = { online: 'text-success', offline: 'text-text-faint', dnd: 'text-danger' };

  return (
    <div className="flex items-center gap-3 py-3 border-b border-border-subtle last:border-0 hover:bg-surface-hover/30 px-2 rounded-lg transition-colors">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-secondary to-blue-800 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
        {user.avatar}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text-main truncate">{user.name}</p>
        <p className="text-xs text-text-faint truncate">{user.email}</p>
      </div>
      <span className={roleColors[user.role]}>{user.role}</span>
      <span className={`text-xs font-medium ${statusColors[user.status]} capitalize`}>{user.status}</span>
      {user.branch && <span className="tag-blue text-[10px]">{user.branch}</span>}
      <div className="flex gap-1">
        <button onClick={() => onAction('view', user)} className="p-1.5 rounded hover:bg-surface-hover text-text-faint hover:text-text-main transition-colors" title="View profile">
          <Eye className="w-3.5 h-3.5" />
        </button>
        <button onClick={() => onAction('warn', user)} className="p-1.5 rounded hover:bg-warning/20 text-text-faint hover:text-warning transition-colors" title="Warn user">
          <AlertTriangle className="w-3.5 h-3.5" />
        </button>
        <button onClick={() => onAction('ban', user)} className="p-1.5 rounded hover:bg-danger/20 text-text-faint hover:text-danger transition-colors" title="Ban user">
          <UserX className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

function GrievanceCard({ g }) {
  const statusStyles = {
    Open: 'tag-red',
    'In Progress': 'tag-yellow',
    Resolved: 'tag-green',
  };
  return (
    <div className="card p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h4 className="text-sm font-semibold text-text-main">{g.subject}</h4>
          <p className="text-xs text-text-faint mt-0.5">
            {g.isAnonymous ? '🔒 Anonymous' : `Student: ${g.studentId}`} ·
            {g.createdAt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
          </p>
        </div>
        <span className={statusStyles[g.status]}>{g.status}</span>
      </div>
      <p className="text-sm text-text-muted leading-relaxed">{g.description}</p>
      {g.responses.length > 0 && (
        <div className="bg-surface-base rounded-lg p-3 space-y-2">
          {g.responses.map((r, i) => (
            <div key={i}>
              <p className="text-xs font-medium text-brand-secondary-light">{r.by}</p>
              <p className="text-xs text-text-muted mt-0.5">{r.text}</p>
            </div>
          ))}
        </div>
      )}
      <div className="flex gap-2">
        <input className="input text-xs py-1.5 flex-1" placeholder="Add response…" />
        <button className="btn-primary text-xs px-3">Reply</button>
      </div>
    </div>
  );
}

function AuditRow({ log }) {
  const actionColors = {
    USER_ROLE_CHANGED: 'text-warning',
    MESSAGE_PINNED: 'text-info',
    RESOURCE_UPLOADED: 'text-success',
    QUIZ_CREATED: 'text-purple-400',
    ANNOUNCEMENT_POSTED: 'text-brand-secondary-light',
  };
  return (
    <div className="flex items-start gap-3 py-3 border-b border-border-subtle last:border-0 text-sm">
      <div className="w-8 h-8 rounded-full bg-surface-hover flex items-center justify-center text-xs font-bold text-text-muted flex-shrink-0">
        {log.actorName?.split(' ').map(p => p[0]).join('').slice(0, 2)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-text-main">
          <span className="font-medium">{log.actorName}</span>{' '}
          <span className={`font-mono text-xs ${actionColors[log.action] || 'text-text-muted'}`}>{log.action}</span>{' '}
          <span className="text-text-muted">on {log.targetType}</span>
        </p>
        {Object.keys(log.metadata || {}).length > 0 && (
          <p className="text-xs text-text-faint mt-0.5">{JSON.stringify(log.metadata)}</p>
        )}
      </div>
      <span className="text-xs text-text-faint flex-shrink-0">
        {log.timestamp.toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
      </span>
    </div>
  );
}

export default function AdminPanel() {
  const { currentUser, users, messages, auditLogs, grievances } = useApp();
  const [tab, setTab] = useState('Overview');
  const [userSearch, setUserSearch] = useState('');

  if (!['Admin', 'Faculty'].includes(currentUser?.role)) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-text-faint mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-text-main">Access Restricted</h3>
          <p className="text-text-muted text-sm mt-1">You don't have permission to view this panel.</p>
        </div>
      </div>
    );
  }

  const totalMessages = Object.values(messages).reduce((a, ms) => a + ms.length, 0);
  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  );
  const openGrievances = grievances.filter(g => g.status !== 'Resolved').length;

  const onUserAction = (action, user) => {
    alert(`Action "${action}" performed on ${user.name} (mock)`);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <div className="px-6 py-4 border-b border-border-subtle bg-surface-panel/60 backdrop-blur-sm flex-shrink-0">
        <h1 className="text-lg font-bold text-text-main flex items-center gap-2">
          <Shield className="w-5 h-5 text-brand-primary" /> Admin Command Center
        </h1>
        <div className="flex gap-1 mt-3">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all relative ${
                tab === t ? 'bg-brand-primary text-white' : 'text-text-muted hover:text-text-main hover:bg-surface-hover'
              }`}>
              {t}
              {t === 'Grievances' && openGrievances > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-danger text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {openGrievances}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 scrollable p-6">
        {/* Overview */}
        {tab === 'Overview' && (
          <div className="space-y-5 animate-fade-in">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Users', val: users.length, icon: Users, color: 'bg-brand-secondary/15 text-brand-secondary-light' },
                { label: 'Messages Today', val: totalMessages, icon: MessageSquare, color: 'bg-success/15 text-success' },
                { label: 'Open Grievances', val: openGrievances, icon: AlertTriangle, color: 'bg-danger/15 text-danger' },
                { label: 'Audit Events', val: auditLogs.length, icon: Activity, color: 'bg-brand-gold/15 text-brand-gold' },
              ].map(s => (
                <div key={s.label} className="card p-4 flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}>
                    <s.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-text-main">{s.val}</p>
                    <p className="text-xs text-text-muted">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* User role breakdown */}
            <div className="card p-5">
              <h3 className="font-semibold text-text-main mb-3 flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-brand-primary" /> User Role Distribution
              </h3>
              <div className="space-y-3">
                {['Admin', 'Faculty', 'Student'].map(role => {
                  const count = users.filter(u => u.role === role).length;
                  const pct = Math.round((count / users.length) * 100);
                  return (
                    <div key={role} className="flex items-center gap-3">
                      <span className="text-xs text-text-muted w-16">{role}</span>
                      <div className="flex-1 progress-bar">
                        <div className={`progress-fill ${role === 'Admin' ? 'bg-brand-primary' : role === 'Faculty' ? 'bg-brand-secondary' : 'bg-success'}`}
                          style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs text-text-muted w-12 text-right">{count} ({pct}%)</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent audit */}
            <div className="card p-5">
              <h3 className="font-semibold text-text-main mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-primary" /> Recent Activity
              </h3>
              <div>
                {auditLogs.slice(0, 5).map(log => <AuditRow key={log.id} log={log} />)}
              </div>
            </div>
          </div>
        )}

        {/* Users */}
        {tab === 'Users' && (
          <div className="space-y-4 animate-fade-in">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-faint" />
              <input value={userSearch} onChange={e => setUserSearch(e.target.value)}
                placeholder="Search users by name or email…" className="input pl-9" />
            </div>
            <div className="card p-5">
              <p className="text-xs text-text-faint mb-3">{filteredUsers.length} users</p>
              {filteredUsers.map(u => <UserRow key={u.uid} user={u} onAction={onUserAction} />)}
            </div>
          </div>
        )}

        {/* Audit Log */}
        {tab === 'Audit Log' && (
          <div className="card p-5 animate-fade-in">
            <h3 className="font-semibold text-text-main mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4 text-brand-primary" /> Full Audit Log
            </h3>
            <p className="text-xs text-text-faint mb-3">Append-only. All sensitive actions are recorded.</p>
            {auditLogs.map(log => <AuditRow key={log.id} log={log} />)}
          </div>
        )}

        {/* Grievances */}
        {tab === 'Grievances' && (
          <div className="space-y-4 animate-fade-in">
            <p className="text-sm text-text-muted">{grievances.length} total · {openGrievances} unresolved</p>
            {grievances.map(g => <GrievanceCard key={g.id} g={g} />)}
          </div>
        )}
      </div>
    </div>
  );
}
