import { createContext, useContext, useState, useCallback } from 'react';
import {
  MOCK_USERS, MOCK_CHANNELS, MOCK_MESSAGES, MOCK_RESOURCES,
  MOCK_QUIZZES, MOCK_PLACEMENT_DRIVES, MOCK_PLACEMENT_STATS,
  MOCK_ATTENDANCE, MOCK_TIMETABLE, MOCK_GRIEVANCES, MOCK_AUDIT_LOGS,
  DLP_PATTERNS
} from '../mockData';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentView, setCurrentView] = useState('chat');
  const [activeChannel, setActiveChannel] = useState('ann-general');
  const [users, setUsers] = useState(MOCK_USERS);
  const [channels] = useState(MOCK_CHANNELS);
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [resources] = useState(MOCK_RESOURCES);
  const [quizzes] = useState(MOCK_QUIZZES);
  const [placementDrives] = useState(MOCK_PLACEMENT_DRIVES);
  const [placementStats] = useState(MOCK_PLACEMENT_STATS);
  const [attendance] = useState(MOCK_ATTENDANCE);
  const [timetable] = useState(MOCK_TIMETABLE);
  const [grievances, setGrievances] = useState(MOCK_GRIEVANCES);
  const [auditLogs, setAuditLogs] = useState(MOCK_AUDIT_LOGS);
  const [notifications, setNotifications] = useState([
    { id: 'n1', type: 'announcement', title: 'New Placement Drive', message: 'Google drive registration is now open!', read: false, time: new Date(Date.now() - 3600000) },
    { id: 'n2', type: 'quiz', title: 'Quiz starting soon', message: 'DSA Quiz begins in 15 minutes', read: false, time: new Date(Date.now() - 1800000) },
    { id: 'n3', type: 'mention', title: 'You were mentioned', message: '@aryan.kapoor check the resource channel', read: true, time: new Date(Date.now() - 86400000) },
  ]);
  const [activeDM, setActiveDM] = useState(null);
  const [dmMessages, setDmMessages] = useState({});
  const [rightPanel, setRightPanel] = useState(null); // 'thread', 'members', 'details'
  const [threadParent, setThreadParent] = useState(null);

  const login = useCallback((email, password) => {
    // Mock auth — match by email
    const user = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user && password.length >= 6) {
      setCurrentUser(user);
      return { success: true };
    }
    return { success: false, error: 'Invalid credentials. Try any @dypiu.ac.in email with 6+ char password.' };
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    setCurrentView('chat');
    setActiveChannel('ann-general');
  }, []);

  const runDLP = useCallback((text) => {
    for (const p of DLP_PATTERNS) {
      p.pattern.lastIndex = 0;
      if (p.pattern.test(text)) {
        return { blocked: p.severity === 'block', warning: p.severity === 'warn', label: p.label };
      }
    }
    return { blocked: false, warning: false };
  }, []);

  const sendMessage = useCallback((channelId, text) => {
    if (!text.trim() || !currentUser) return;
    const dlp = runDLP(text);
    if (dlp.blocked) return { error: `Message blocked — contains ${dlp.label}` };

    const maskedText = text.replace(/[2-9]{1}[0-9]{3}\s[0-9]{4}\s[0-9]{4}/g, '[AADHAAR MASKED]')
                           .replace(/[A-Z]{5}[0-9]{4}[A-Z]{1}/g, '[PAN MASKED]');

    const newMsg = {
      id: `m${Date.now()}`,
      channelId,
      senderId: currentUser.uid,
      senderName: currentUser.name,
      text: maskedText,
      timestamp: new Date(),
      reactions: {},
      isPinned: false,
      replyTo: null,
    };
    setMessages(prev => ({
      ...prev,
      [channelId]: [...(prev[channelId] || []), newMsg],
    }));
    return { success: true };
  }, [currentUser, runDLP]);

  const sendDM = useCallback((toUid, text) => {
    if (!text.trim() || !currentUser) return;
    const dmKey = [currentUser.uid, toUid].sort().join('-');
    const newMsg = {
      id: `dm${Date.now()}`,
      senderId: currentUser.uid,
      senderName: currentUser.name,
      text,
      timestamp: new Date(),
      read: false,
    };
    setDmMessages(prev => ({
      ...prev,
      [dmKey]: [...(prev[dmKey] || []), newMsg],
    }));
  }, [currentUser]);

  const addReaction = useCallback((channelId, messageId, emoji) => {
    setMessages(prev => {
      const msgs = prev[channelId] || [];
      return {
        ...prev,
        [channelId]: msgs.map(m => {
          if (m.id !== messageId) return m;
          const existing = m.reactions[emoji] || [];
          const already = existing.includes(currentUser.uid);
          return {
            ...m,
            reactions: {
              ...m.reactions,
              [emoji]: already ? existing.filter(u => u !== currentUser.uid) : [...existing, currentUser.uid],
            },
          };
        }),
      };
    });
  }, [currentUser]);

  const addLog = useCallback((action, targetId, targetType, metadata = {}) => {
    const log = {
      id: `al${Date.now()}`,
      actorId: currentUser?.uid,
      actorName: currentUser?.name,
      action,
      targetId,
      targetType,
      timestamp: new Date(),
      metadata,
    };
    setAuditLogs(prev => [log, ...prev]);
  }, [currentUser]);

  const markNotificationRead = useCallback((id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const submitGrievance = useCallback((subject, description, isAnonymous) => {
    const g = {
      id: `g${Date.now()}`,
      studentId: currentUser.uid,
      isAnonymous,
      subject,
      description,
      status: 'Open',
      createdAt: new Date(),
      responses: [],
    };
    setGrievances(prev => [g, ...prev]);
  }, [currentUser]);

  const value = {
    currentUser, setCurrentUser, currentView, setCurrentView,
    activeChannel, setActiveChannel,
    users, channels, messages, resources, quizzes,
    placementDrives, placementStats, attendance, timetable,
    grievances, auditLogs, notifications,
    activeDM, setActiveDM,
    dmMessages,
    rightPanel, setRightPanel,
    threadParent, setThreadParent,
    login, logout, sendMessage, sendDM, addReaction,
    addLog, markNotificationRead, submitGrievance, runDLP,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
