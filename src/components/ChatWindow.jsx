import { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  Hash, Megaphone, BookOpen, Lock, Send, Pin, Smile, Reply,
  MoreHorizontal, ChevronRight, X, MessageSquare, Loader,
  AlertTriangle, CheckCheck, Paperclip
} from 'lucide-react';

const CHANNEL_ICONS = {
  announcement: Megaphone,
  general: Hash,
  resource: BookOpen,
  admin: Lock,
};

const EMOJI_PICKS = ['👍', '❤️', '😂', '🔥', '🎉', '👀', '🙌', '💯'];

function EmojiPicker({ onSelect, onClose }) {
  return (
    <div className="absolute bottom-8 right-0 bg-surface-panel border border-border-subtle rounded-xl p-2 flex gap-1 shadow-panel z-10 animate-slide-up">
      {EMOJI_PICKS.map(e => (
        <button key={e} onClick={() => { onSelect(e); onClose(); }}
          className="w-8 h-8 hover:bg-surface-hover rounded-lg flex items-center justify-center text-lg transition-colors">
          {e}
        </button>
      ))}
    </div>
  );
}

function MessageBubble({ msg, isOwn, channelType, onReply }) {
  const { addReaction, currentUser } = useApp();
  const [showActions, setShowActions] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);

  const timeStr = msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const reactions = Object.entries(msg.reactions || {}).filter(([, uids]) => uids.length > 0);

  return (
    <div className={`group flex gap-3 px-4 py-1.5 hover:bg-surface-hover/30 rounded-lg transition-colors relative ${isOwn ? '' : ''}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => { setShowActions(false); setShowEmoji(false); }}>

      {/* Avatar */}
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-secondary to-blue-800 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
        {msg.senderName?.split(' ').map(p => p[0]).join('').slice(0, 2)}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-semibold text-text-main">{msg.senderName}</span>
          <span className="text-[11px] text-text-faint">{timeStr}</span>
          {msg.isPinned && (
            <span className="flex items-center gap-1 text-[10px] text-brand-gold bg-brand-gold/10 px-1.5 py-0.5 rounded">
              <Pin className="w-2.5 h-2.5" /> pinned
            </span>
          )}
        </div>

        {msg.replyTo && (
          <div className="flex items-center gap-2 text-xs text-text-faint mb-1 border-l-2 border-brand-secondary/50 pl-2 py-0.5">
            <Reply className="w-3 h-3" />
            <span className="italic truncate">{msg.replyTo}</span>
          </div>
        )}

        <p className="text-sm text-text-main leading-relaxed break-words whitespace-pre-wrap">{msg.text}</p>

        {/* Reactions */}
        {reactions.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1.5">
            {reactions.map(([emoji, uids]) => (
              <button key={emoji}
                onClick={() => addReaction(msg.channelId, msg.id, emoji)}
                className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border transition-all ${
                  uids.includes(currentUser?.uid)
                    ? 'bg-brand-secondary/20 border-brand-secondary/40 text-text-main'
                    : 'bg-surface-hover border-border-subtle text-text-muted hover:border-border-medium'
                }`}>
                {emoji} <span className="font-medium">{uids.length}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Action buttons */}
      {showActions && channelType !== 'announcement' && (
        <div className="absolute right-4 top-1 flex items-center gap-1 bg-surface-panel border border-border-subtle rounded-lg p-1 shadow-panel z-10 animate-fade-in">
          <div className="relative">
            <button onClick={() => setShowEmoji(p => !p)}
              className="btn-ghost p-1.5 rounded-md" title="React">
              <Smile className="w-4 h-4" />
            </button>
            {showEmoji && (
              <EmojiPicker
                onSelect={emoji => addReaction(msg.channelId, msg.id, emoji)}
                onClose={() => setShowEmoji(false)}
              />
            )}
          </div>
          <button onClick={() => onReply(msg)} className="btn-ghost p-1.5 rounded-md" title="Reply in thread">
            <Reply className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

function ThreadPanel({ parentMsg, onClose }) {
  const { currentUser, sendMessage, messages } = useApp();
  const [input, setInput] = useState('');
  const channelMsgs = messages[parentMsg.channelId] || [];

  return (
    <div className="w-80 flex flex-col border-l border-border-subtle bg-surface-panel animate-slide-in">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-text-muted" />
          <h3 className="font-semibold text-text-main text-sm">Thread</h3>
        </div>
        <button onClick={onClose} className="text-text-faint hover:text-text-main transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 border-b border-border-subtle bg-surface-base/30">
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-primary to-red-800 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {parentMsg.senderName?.split(' ').map(p => p[0]).join('').slice(0, 2)}
          </div>
          <div>
            <p className="text-xs font-semibold text-text-main">{parentMsg.senderName}</p>
            <p className="text-xs text-text-muted mt-0.5 leading-relaxed">{parentMsg.text.slice(0, 100)}{parentMsg.text.length > 100 ? '…' : ''}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 scrollable p-3 space-y-2">
        <p className="text-xs text-text-faint text-center">Replies to this message will appear here</p>
      </div>

      <div className="p-3 border-t border-border-subtle">
        <div className="flex items-center gap-2 bg-surface-base border border-border-medium rounded-xl px-3 py-2">
          <input value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); if (input.trim()) { sendMessage(parentMsg.channelId, `↩ ${input}`); setInput(''); } } }}
            placeholder="Reply in thread…"
            className="flex-1 bg-transparent text-sm text-text-main placeholder-text-faint outline-none" />
          <button onClick={() => { if (input.trim()) { sendMessage(parentMsg.channelId, `↩ ${input}`); setInput(''); } }}
            className="text-brand-primary hover:text-brand-primary-light transition-colors">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ChatWindow() {
  const { activeChannel, channels, messages, sendMessage, currentUser, runDLP } = useApp();
  const [input, setInput] = useState('');
  const [dlpWarning, setDlpWarning] = useState(null);
  const [dlpBlocked, setDlpBlocked] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [threadMsg, setThreadMsg] = useState(null);
  const messagesEndRef = useRef(null);

  const channel = channels.find(c => c.id === activeChannel);
  const channelMessages = messages[activeChannel] || [];
  const Icon = CHANNEL_ICONS[channel?.type] || Hash;

  const isReadOnly = channel?.type === 'announcement' && currentUser?.role === 'Student';
  const isAdminOnly = channel?.type === 'admin' && currentUser?.role === 'Student';

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [channelMessages.length]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInput(val);
    const dlp = runDLP(val);
    if (dlp.blocked) { setDlpBlocked(true); setDlpWarning(`⚠️ Contains ${dlp.label} — cannot send`); }
    else if (dlp.warning) { setDlpBlocked(false); setDlpWarning(`ℹ️ Contains ${dlp.label} — proceed with caution`); }
    else { setDlpBlocked(false); setDlpWarning(null); }
  };

  const handleSend = async () => {
    if (!input.trim() || dlpBlocked || isSending) return;
    setIsSending(true);
    sendMessage(activeChannel, input.trim());
    setInput('');
    setDlpWarning(null);
    await new Promise(r => setTimeout(r, 100));
    setIsSending(false);
  };

  if (isAdminOnly) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Lock className="w-12 h-12 text-text-faint mx-auto mb-3" />
          <h3 className="text-text-main font-semibold">Restricted Channel</h3>
          <p className="text-text-muted text-sm mt-1">You don't have access to this channel.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex overflow-hidden h-full">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-3.5 border-b border-border-subtle bg-surface-panel/60 backdrop-blur-sm flex-shrink-0">
          <Icon className="w-5 h-5 text-text-muted" />
          <div>
            <h2 className="font-semibold text-text-main text-sm">{channel?.name || 'channel'}</h2>
            <p className="text-[11px] text-text-faint capitalize">{channel?.type} channel</p>
          </div>
          {isReadOnly && (
            <span className="ml-auto tag-yellow flex items-center gap-1">
              <Lock className="w-3 h-3" /> Read-only
            </span>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 scrollable py-4 space-y-0.5">
          {channelMessages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center px-8">
              <div className="w-16 h-16 rounded-2xl bg-surface-hover flex items-center justify-center mb-4">
                <Icon className="w-8 h-8 text-text-faint" />
              </div>
              <h3 className="font-semibold text-text-main">Welcome to #{channel?.name}</h3>
              <p className="text-text-muted text-sm mt-1">This is the beginning of this channel. Say hello!</p>
            </div>
          )}
          {channelMessages.map(msg => (
            <MessageBubble
              key={msg.id}
              msg={msg}
              isOwn={msg.senderId === currentUser?.uid}
              channelType={channel?.type}
              onReply={setThreadMsg}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* DLP Warning */}
        {dlpWarning && (
          <div className={`mx-4 mb-1 flex items-center gap-2 px-3 py-2 rounded-lg text-sm animate-fade-in ${
            dlpBlocked ? 'bg-danger/10 border border-danger/30 text-danger' : 'bg-warning/10 border border-warning/30 text-warning'
          }`}>
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            {dlpWarning}
          </div>
        )}

        {/* Message Input */}
        {!isReadOnly && (
          <div className="px-4 pb-4 flex-shrink-0">
            <div className={`flex items-end gap-3 bg-surface-hover border rounded-xl px-4 py-3 transition-all duration-200 ${
              dlpBlocked ? 'border-danger/50' : 'border-border-medium focus-within:border-brand-primary/50'
            }`}>
              <button className="text-text-faint hover:text-text-muted transition-colors flex-shrink-0 mb-0.5">
                <Paperclip className="w-5 h-5" />
              </button>
              <textarea
                value={input}
                onChange={handleInputChange}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder={`Message #${channel?.name || 'channel'}…`}
                rows={1}
                className="flex-1 bg-transparent text-sm text-text-main placeholder-text-faint outline-none resize-none leading-relaxed max-h-32"
                style={{ minHeight: '24px' }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || dlpBlocked || isSending}
                className={`flex-shrink-0 mb-0.5 transition-all duration-200 ${
                  input.trim() && !dlpBlocked
                    ? 'text-brand-primary hover:text-brand-primary-light'
                    : 'text-text-faint cursor-not-allowed'
                }`}>
                {isSending ? <Loader className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-[10px] text-text-faint mt-1 px-1">Press Enter to send · Shift+Enter for new line · DLP scanner active</p>
          </div>
        )}
        {isReadOnly && (
          <div className="px-4 pb-4">
            <div className="flex items-center justify-center gap-2 bg-surface-hover/50 border border-border-subtle rounded-xl px-4 py-3 text-sm text-text-faint">
              <Lock className="w-4 h-4" />
              Only faculty and admins can post in this channel. You can react to messages.
            </div>
          </div>
        )}
      </div>

      {/* Thread panel */}
      {threadMsg && <ThreadPanel parentMsg={threadMsg} onClose={() => setThreadMsg(null)} />}
    </div>
  );
}
