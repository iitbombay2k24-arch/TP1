import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FileText, CheckCircle2, XCircle, Calendar, Clock, AlertTriangle } from 'lucide-react';

export default function AttendanceModule() {
  const { attendance, currentUser, timetable } = useApp();
  const [activeTab, setActiveTab] = useState('attendance');

  const myAttendance = attendance[currentUser?.uid] || [];
  const present = myAttendance.filter(a => a.status === 'present').length;
  const absent = myAttendance.filter(a => a.status === 'absent').length;
  const total = myAttendance.length;
  const pct = total > 0 ? Math.round((present / total) * 100) : 0;

  const typeColors = {
    lecture: 'bg-brand-secondary/15 text-brand-secondary-light',
    assessment: 'bg-brand-primary/15 text-brand-primary-light',
    workshop: 'bg-purple-500/15 text-purple-400',
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <div className="px-6 py-4 border-b border-border-subtle bg-surface-panel/60 backdrop-blur-sm flex-shrink-0">
        <h1 className="text-lg font-bold text-text-main flex items-center gap-2">
          <FileText className="w-5 h-5 text-brand-primary" /> Attendance & Timetable
        </h1>
        <div className="flex gap-1 mt-3">
          {['attendance', 'timetable'].map(t => (
            <button key={t} onClick={() => setActiveTab(t)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${
                activeTab === t ? 'bg-brand-primary text-white' : 'text-text-muted hover:text-text-main hover:bg-surface-hover'
              }`}>{t}</button>
          ))}
        </div>
      </div>

      <div className="flex-1 scrollable p-6">
        {activeTab === 'attendance' && (
          <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
            {/* Circular/visual attendance */}
            <div className="card p-6 flex items-center gap-6">
              <div className="relative w-28 h-28 flex-shrink-0">
                <svg viewBox="0 0 36 36" className="w-28 h-28 -rotate-90">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1E293B" strokeWidth="3" />
                  <circle cx="18" cy="18" r="15.9" fill="none"
                    stroke={pct >= 75 ? '#22C55E' : pct >= 60 ? '#F59E0B' : '#EF4444'}
                    strokeWidth="3"
                    strokeDasharray={`${pct} ${100 - pct}`}
                    strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-2xl font-bold ${pct >= 75 ? 'text-success' : pct >= 60 ? 'text-warning' : 'text-danger'}`}>{pct}%</span>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-text-main">Overall Attendance</h3>
                <div className="flex gap-4 mt-2 text-sm">
                  <span className="flex items-center gap-1.5 text-success"><CheckCircle2 className="w-4 h-4" />{present} present</span>
                  <span className="flex items-center gap-1.5 text-danger"><XCircle className="w-4 h-4" />{absent} absent</span>
                </div>
                {pct < 75 && (
                  <div className="flex items-center gap-1.5 mt-2 text-xs text-warning bg-warning/10 px-2 py-1 rounded-lg">
                    <AlertTriangle className="w-3.5 h-3.5" /> Below 75% threshold!
                  </div>
                )}
              </div>
            </div>

            {/* Session log */}
            <div className="card p-5">
              <h3 className="font-semibold text-text-main mb-3">Session History</h3>
              <div className="space-y-2">
                {myAttendance.length === 0 && (
                  <p className="text-text-faint text-sm text-center py-4">No attendance records yet</p>
                )}
                {myAttendance.map((a, i) => (
                  <div key={i} className="flex items-center gap-3 py-2 border-b border-border-subtle last:border-0">
                    <div className={`flex-shrink-0 ${a.status === 'present' ? 'text-success' : 'text-danger'}`}>
                      {a.status === 'present' ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-text-main">{a.subject}</p>
                      <p className="text-xs text-text-faint">{new Date(a.date).toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short' })}</p>
                    </div>
                    <span className={a.status === 'present' ? 'tag-green' : 'tag-red'}>{a.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'timetable' && (
          <div className="space-y-4 animate-fade-in">
            {timetable.map(day => (
              <div key={day.day} className="card p-5">
                <h3 className="font-semibold text-text-main mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-brand-primary" /> {day.day}
                </h3>
                <div className="space-y-2">
                  {day.sessions.map((s, i) => (
                    <div key={i} className="flex items-center gap-4 py-2.5 border-b border-border-subtle last:border-0">
                      <div className="flex items-center gap-1.5 text-xs text-text-faint w-24 flex-shrink-0">
                        <Clock className="w-3.5 h-3.5" />{s.time}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-text-main">{s.subject}</p>
                        <p className="text-xs text-text-faint">{s.faculty} · {s.room}</p>
                      </div>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${typeColors[s.type]}`}>{s.type}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
