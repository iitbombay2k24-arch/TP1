import { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  MessageSquare, BookOpen, ClipboardList, BarChart2, Settings,
  Bell, Search, LogOut, Hash, Megaphone, Lock, ChevronDown,
  ChevronRight, Shield, Users, FileText, X
} from 'lucide-react';

const VIEWS = [
  { id: 'chat', icon: MessageSquare, label: 'Channels' },
  { id: 'dms', icon: Users, label: 'Direct Messages' },
  { id: 'resources', icon: BookOpen, label: 'Resources' },
  { id: 'quiz', icon: ClipboardList, label: 'Quizzes' },
  { id: 'placement', icon: BarChart2, label: 'Placement' },
  { id: 'attendance', icon: FileText, label: 'Attendance' },
  { id: 'admin', icon: Shield, label: 'Admin', adminOnly: true },
];

const CHANNEL_ICONS = {
  announcement: Megaphone,
  general: Hash,
  resource: BookOpen,
  admin: Lock,
};

function NotificationDropdown({ onClose }) {
  const { notifications, markNotificationRead } = useApp();
  return (
    <div className="absolute right-0 top-12 w-80 card shadow-panel z-50 animate-slide-up overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle">
        <h3 className="font-semibold text-text-main text-sm">Notifications</h3>
        <button onClick={onClose} className="text-text-faint hover:text-text-main"><X className="w-4 h-4" /></button>
      </div>
      <div className="max-h-80 scrollable">
        {notifications.length === 0 && (
          <p className="text-text-faint text-sm text-center py-8">No notifications</p>
        )}
        {notifications.map(n => (
          <div key={n.id} onClick={() => markNotificationRead(n.id)}
            className={`px-4 py-3 border-b border-border-subtle cursor-pointer transition-colors hover:bg-surface-hover ${n.read ? 'opacity-60' : ''}`}>
            <div className="flex items-start gap-3">
              {!n.read && <div className="w-2 h-2 rounded-full bg-brand-primary mt-1 flex-shrink-0" />}
              {n.read && <div className="w-2 h-2 mt-1 flex-shrink-0" />}
              <div>
                <p className="text-sm font-medium text-text-main">{n.title}</p>
                <p className="text-xs text-text-muted mt-0.5">{n.message}</p>
                <p className="text-[10px] text-text-faint mt-1">{n.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SearchModal({ onClose }) {
  const { channels, messages, resources } = useApp();
  const [query, setQuery] = useState('');

  const results = query.length > 1 ? [
    ...Object.values(messages).flat().filter(m => m.text.toLowerCase().includes(query.toLowerCase())).slice(0, 3).map(m => ({ type: 'message', ...m })),
    ...resources.filter(r => r.title.toLowerCase().includes(query.toLowerCase())).slice(0, 3).map(r => ({ type: 'resource', ...r })),
    ...channels.filter(c => c.name.toLowerCase().includes(query.toLowerCase())).map(c => ({ type: 'channel', ...c })),
  ] : [];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-24 animate-fade-in" onClick={onClose}>
      <div className="w-full max-w-xl mx-4 card shadow-panel" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border-subtle">
          <Search className="w-5 h-5 text-text-muted" />
          <input autoFocus value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Search messages, resources, channels…"
            className="bg-transparent text-text-main placeholder-text-faint flex-1 outline-none text-sm" />
          <kbd className="text-xs bg-surface-hover text-text-muted px-2 py-1 rounded">ESC</kbd>
        </div>
        {results.length > 0 && (
          <div className="max-h-64 scrollable p-2">
            {results.map((r, i) => (
              <div key={i} onClick={onClose}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-surface-hover cursor-pointer transition-colors">
                <div className="w-8 h-8 rounded-lg bg-surface-hover flex items-center justify-center flex-shrink-0">
                  {r.type === 'message' && <MessageSquare className="w-4 h-4 text-brand-secondary-light" />}
                  {r.type === 'resource' && <FileText className="w-4 h-4 text-brand-gold" />}
                  {r.type === 'channel' && <Hash className="w-4 h-4 text-text-muted" />}
                </div>
                <div>
                  <p className="text-sm text-text-main font-medium">
                    {r.type === 'message' ? r.text.slice(0, 50) + '…' : r.type === 'resource' ? r.title : r.name}
                  </p>
                  <p className="text-xs text-text-faint capitalize">{r.type}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        {query.length > 1 && results.length === 0 && (
          <p className="text-center text-text-faint text-sm py-8">No results for "{query}"</p>
        )}
        {query.length === 0 && (
          <p className="text-center text-text-faint text-sm py-8">Start typing to search…</p>
        )}
      </div>
    </div>
  );
}

export default function AppShell({ children }) {
  const { currentUser, currentView, setCurrentView, channels, activeChannel, setActiveChannel,
    notifications, logout, users, activeDM, setActiveDM } = useApp();

  const [expandedCategories, setExpandedCategories] = useState({
    '📢 Announcements': true,
    '💬 General Chat': true,
    '📚 Resources': false,
    '🔒 Admin': false,
  });
  const [showNotifs, setShowNotifs] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const toggleCategory = (cat) => setExpandedCategories(p => ({ ...p, [cat]: !p[cat] }));

  const canSeeChannel = (ch) => {
    if (ch.type === 'admin') return ['Admin', 'Faculty'].includes(currentUser?.role);
    return true;
  };

  const visibleViews = VIEWS.filter(v => !v.adminOnly || ['Admin', 'Faculty'].includes(currentUser?.role));
  const groupedChannels = channels.reduce((acc, ch) => {
    if (!canSeeChannel(ch)) return acc;
    if (!acc[ch.category]) acc[ch.category] = [];
    acc[ch.category].push(ch);
    return acc;
  }, {});

  const otherUsers = users.filter(u => u.uid !== currentUser?.uid);

  return (
    <div className="h-screen flex overflow-hidden bg-surface-base">
      {/* App Rail */}
      <div className="w-16 flex flex-col items-center py-3 gap-1 bg-surface-base border-r border-border-subtle flex-shrink-0">
        {/* Logo */}
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary to-red-800 flex items-center justify-center mb-3 shadow-glow-red flex-shrink-0">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <div className="w-8 h-px bg-border-subtle mb-2" />

        {visibleViews.map(v => {
          const Icon = v.icon;
          const active = currentView === v.id;
          return (
            <button key={v.id} onClick={() => setCurrentView(v.id)}
              title={v.label}
              id={`nav-${v.id}`}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 group relative ${
                active
                  ? 'bg-brand-primary text-white shadow-glow-red'
                  : 'text-text-faint hover:text-text-main hover:bg-surface-hover'
              }`}>
              <Icon className="w-5 h-5" />
              {active && <div className="absolute left-0 w-0.5 h-6 bg-brand-primary rounded-r-full -left-1" />}
              <span className="absolute left-14 bg-surface-panel text-text-main text-xs px-2 py-1 rounded-md border border-border-subtle opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-panel">
                {v.label}
              </span>
            </button>
          );
        })}

        <div className="flex-1" />

        {/* Search */}
        <button onClick={() => setShowSearch(true)}
          className="w-10 h-10 rounded-xl text-text-faint hover:text-text-main hover:bg-surface-hover flex items-center justify-center transition-all duration-200"
          title="Search (Ctrl+K)">
          <Search className="w-5 h-5" />
        </button>

        {/* Notifications */}
        <div className="relative">
          <button onClick={() => setShowNotifs(p => !p)}
            className="w-10 h-10 rounded-xl text-text-faint hover:text-text-main hover:bg-surface-hover flex items-center justify-center transition-all duration-200"
            id="btn-notifications">
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-brand-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
          {showNotifs && <NotificationDropdown onClose={() => setShowNotifs(false)} />}
        </div>

        {/* User avatar */}
        <div className="relative">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-secondary to-blue-800 flex items-center justify-center text-white text-sm font-bold cursor-pointer"
            title={currentUser?.name}>
            {currentUser?.avatar}
          </div>
          <div className="absolute bottom-0 right-0 status-online" />
        </div>

        {/* Logout */}
        <button onClick={logout}
          className="w-10 h-10 rounded-xl text-text-faint hover:text-danger hover:bg-danger/10 flex items-center justify-center transition-all duration-200 mt-1"
          title="Sign out" id="btn-logout">
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      {/* Sidebar */}
      {(currentView === 'chat' || currentView === 'dms') && (
        <div className="w-60 flex flex-col bg-surface-panel border-r border-border-subtle flex-shrink-0">
          <div className="px-3 py-4 border-b border-border-subtle">
            <h2 className="text-xs font-semibold text-text-faint uppercase tracking-wider px-2">
              {currentView === 'chat' ? 'Channels' : 'Direct Messages'}
            </h2>
          </div>
          <div className="flex-1 scrollable py-2">
            {currentView === 'chat' && Object.entries(groupedChannels).map(([cat, chs]) => (
              <div key={cat} className="mb-1">
                <button onClick={() => toggleCategory(cat)}
                  className="flex items-center gap-1 w-full px-3 py-1 text-xs font-semibold text-text-faint hover:text-text-muted uppercase tracking-wider transition-colors">
                  {expandedCategories[cat] ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                  {cat}
                </button>
                {expandedCategories[cat] && (
                  <div className="px-2 mt-0.5">
                    {chs.map(ch => {
                      const Icon = CHANNEL_ICONS[ch.type] || Hash;
                      const active = activeChannel === ch.id;
                      return (
                        <button key={ch.id} onClick={() => { setActiveChannel(ch.id); setCurrentView('chat'); }}
                          id={`channel-${ch.id}`}
                          className={`w-full text-left ${active ? 'channel-item-active' : 'channel-item'}`}>
                          <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                          <span className="truncate">{ch.name}</span>
                          {ch.isLocked && <Lock className="w-3 h-3 ml-auto text-text-faint flex-shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
            {currentView === 'dms' && (
              <div className="px-2">
                {otherUsers.map(u => (
                  <button key={u.uid} onClick={() => { setActiveDM(u); setCurrentView('dms'); }}
                    className={`w-full text-left ${activeDM?.uid === u.uid ? 'channel-item-active' : 'channel-item'}`}>
                    <div className="relative flex-shrink-0">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-brand-secondary to-blue-800 flex items-center justify-center text-white text-[10px] font-bold">
                        {u.avatar}
                      </div>
                      <div className={`absolute -bottom-0.5 -right-0.5 status-${u.status}`} />
                    </div>
                    <span className="truncate text-sm">{u.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User status bar */}
          <div className="px-3 py-3 border-t border-border-subtle bg-surface-base/50">
            <div className="flex items-center gap-2">
              <div className="relative flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-primary to-red-800 flex items-center justify-center text-white text-xs font-bold">
                  {currentUser?.avatar}
                </div>
                <div className="absolute bottom-0 right-0 status-online" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-text-main truncate">{currentUser?.name}</p>
                <p className="text-[10px] text-text-faint truncate">{currentUser?.role} • {currentUser?.branch}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 overflow-hidden">
        {children}
      </div>

      {/* Search modal */}
      {showSearch && <SearchModal onClose={() => setShowSearch(false)} />}
    </div>
  );
}
