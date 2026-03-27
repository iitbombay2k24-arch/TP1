import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Send, MessageSquare } from 'lucide-react';

export default function DirectMessages() {
  const { activeDM, currentUser, dmMessages, sendDM, users } = useApp();
  const [input, setInput] = useState('');

  if (!activeDM) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <MessageSquare className="w-16 h-16 text-text-faint mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-text-main">Select a conversation</h3>
          <p className="text-text-muted text-sm mt-1">Choose someone from the left panel to start chatting</p>
        </div>
      </div>
    );
  }

  const dmKey = [currentUser?.uid, activeDM.uid].sort().join('-');
  const msgs = dmMessages[dmKey] || [];

  const handleSend = () => {
    if (!input.trim()) return;
    sendDM(activeDM.uid, input.trim());
    setInput('');
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-3.5 border-b border-border-subtle bg-surface-panel/60 backdrop-blur-sm flex-shrink-0">
        <div className="relative">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-secondary to-blue-800 flex items-center justify-center text-white text-sm font-bold">
            {activeDM.avatar}
          </div>
          <div className={`absolute bottom-0 right-0 status-${activeDM.status}`} />
        </div>
        <div>
          <h2 className="font-semibold text-text-main text-sm">{activeDM.name}</h2>
          <p className="text-[11px] text-text-faint capitalize">{activeDM.status} · {activeDM.role} · {activeDM.branch}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 scrollable py-4 px-4 space-y-3">
        {msgs.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-secondary to-blue-800 flex items-center justify-center text-white text-2xl font-bold mb-4">
              {activeDM.avatar}
            </div>
            <h3 className="font-semibold text-text-main">{activeDM.name}</h3>
            <p className="text-text-muted text-sm mt-1">{activeDM.role} · {activeDM.branch}</p>
            <p className="text-text-faint text-xs mt-3">This is the beginning of your private conversation.</p>
            <p className="text-text-faint text-xs">Messages are end-to-end private.</p>
          </div>
        )}
        {msgs.map(m => {
          const isOwn = m.senderId === currentUser?.uid;
          return (
            <div key={m.id} className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : ''}`}>
              {!isOwn && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-secondary to-blue-800 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {activeDM.avatar}
                </div>
              )}
              <div className={`max-w-xs lg:max-w-md ${isOwn ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  isOwn
                    ? 'bg-brand-primary text-white rounded-tr-sm'
                    : 'bg-surface-hover text-text-main rounded-tl-sm'
                }`}>
                  {m.text}
                </div>
                <span className="text-[10px] text-text-faint">
                  {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div className="px-4 pb-4 flex-shrink-0">
        <div className="flex items-center gap-3 bg-surface-hover border border-border-medium rounded-xl px-4 py-3 focus-within:border-brand-primary/50 transition-all duration-200">
          <input value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
            placeholder={`Message ${activeDM.name}…`}
            className="flex-1 bg-transparent text-sm text-text-main placeholder-text-faint outline-none" />
          <button onClick={handleSend} disabled={!input.trim()}
            className={`transition-colors ${input.trim() ? 'text-brand-primary hover:text-brand-primary-light' : 'text-text-faint cursor-not-allowed'}`}>
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
