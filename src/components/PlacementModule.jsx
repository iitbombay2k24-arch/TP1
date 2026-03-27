import { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  BarChart2, TrendingUp, Building2, Users, Award, DollarSign,
  Calendar, ChevronRight, Filter, CheckCircle2, Clock, XCircle,
  Search, Target, Briefcase, ArrowUpRight
} from 'lucide-react';

function StatCard({ label, value, sub, icon: Icon, color }) {
  return (
    <div className="card p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-2xl font-bold text-text-main">{value}</p>
        <p className="text-sm text-text-muted">{label}</p>
        {sub && <p className="text-xs text-text-faint mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function MiniBar({ label, pct, color }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-text-muted w-12 text-right">{label}</span>
      <div className="flex-1 progress-bar">
        <div className={`progress-fill ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-text-muted w-8">{pct}%</span>
    </div>
  );
}

function MonthlyChart({ data }) {
  const max = Math.max(...data.map(d => d.placed));
  return (
    <div className="flex items-end gap-2 h-24">
      {data.map(d => (
        <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full rounded-t-sm bg-brand-primary/20 hover:bg-brand-primary/40 transition-colors relative group"
            style={{ height: `${(d.placed / max) * 80}px`, minHeight: '4px' }}>
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-surface-panel border border-border-subtle rounded px-1.5 py-0.5 text-[10px] text-text-main opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {d.placed}
            </div>
          </div>
          <span className="text-[10px] text-text-faint">{d.month}</span>
        </div>
      ))}
    </div>
  );
}

function DriveCard({ drive }) {
  const statusStyles = {
    Upcoming: 'tag-blue',
    Open: 'tag-green',
    Completed: 'text-text-faint bg-surface-hover text-xs font-medium px-2 py-0.5 rounded-md',
  };
  const dateStr = drive.date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div className="card-hover p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
            style={{ background: drive.color }}>
            {drive.logo}
          </div>
          <div>
            <h3 className="font-semibold text-text-main text-sm">{drive.company}</h3>
            <p className="text-xs text-text-muted">{drive.role}</p>
          </div>
        </div>
        <span className={statusStyles[drive.status]}>{drive.status}</span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-surface-base rounded-lg px-3 py-2">
          <p className="text-text-faint">CTC</p>
          <p className="text-success font-semibold">{drive.ctcRange}</p>
        </div>
        <div className="bg-surface-base rounded-lg px-3 py-2">
          <p className="text-text-faint">Date</p>
          <p className="text-text-main font-medium">{dateStr}</p>
        </div>
        <div className="bg-surface-base rounded-lg px-3 py-2">
          <p className="text-text-faint">Min CGPA</p>
          <p className="text-text-main font-medium">{drive.eligibility.cgpa}</p>
        </div>
        <div className="bg-surface-base rounded-lg px-3 py-2">
          <p className="text-text-faint">Registered</p>
          <p className="text-text-main font-medium">{drive.registeredCount}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1">
        {drive.eligibility.branches.map(b => (
          <span key={b} className="tag-blue text-[10px]">{b}</span>
        ))}
      </div>

      {drive.status !== 'Completed' && (
        <button className="btn-primary text-sm py-2">
          {drive.status === 'Open' ? 'Register Now' : 'View Details'}
        </button>
      )}
      {drive.status === 'Completed' && (
        <div className="flex items-center gap-2 text-sm text-success">
          <CheckCircle2 className="w-4 h-4" />
          <span>{drive.totalOffers} offers made</span>
        </div>
      )}
    </div>
  );
}

function StudentProfileCard({ user }) {
  const pct = Math.round((user.cgpa / 10) * 100);
  const statusColors = {
    Placed: 'tag-green',
    'In Process': 'tag-yellow',
    Unplaced: 'tag-red',
  };

  return (
    <div className="card-hover p-4 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-secondary to-blue-800 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
          {user.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-text-main text-sm truncate">{user.name}</p>
          <p className="text-xs text-text-faint">{user.branch} · {user.batch}</p>
        </div>
        <span className={statusColors[user.placementStatus]}>{user.placementStatus}</span>
      </div>

      <div>
        <div className="flex justify-between text-xs mb-1">
          <span className="text-text-faint">CGPA</span>
          <span className="text-text-main font-medium">{user.cgpa}/10</span>
        </div>
        <div className="progress-bar h-1.5">
          <div className="progress-fill bg-gradient-to-r from-brand-secondary to-brand-secondary-light" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="flex flex-wrap gap-1">
        {(user.skills || []).slice(0, 4).map(s => (
          <span key={s} className="tag-blue text-[10px]">{s}</span>
        ))}
      </div>
    </div>
  );
}

const TABS = ['Overview', 'Drives', 'Students'];

export default function PlacementModule() {
  const { placementStats, placementDrives, users, currentUser } = useApp();
  const [tab, setTab] = useState('Overview');
  const [cgpaFilter, setCgpaFilter] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const isAdmin = ['Admin', 'Faculty'].includes(currentUser?.role);

  const students = users.filter(u => u.role === 'Student');
  const filteredStudents = students.filter(u => {
    const cgpaOk = !cgpaFilter || u.cgpa >= parseFloat(cgpaFilter);
    const skillOk = !skillFilter || (u.skills || []).some(s => s.toLowerCase().includes(skillFilter.toLowerCase()));
    return cgpaOk && skillOk;
  });

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border-subtle bg-surface-panel/60 backdrop-blur-sm flex-shrink-0">
        <h1 className="text-lg font-bold text-text-main flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-brand-primary" /> Placement Dashboard
        </h1>
        <div className="flex gap-1 mt-3">
          {(isAdmin ? TABS : TABS.filter(t => t !== 'Students')).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                tab === t ? 'bg-brand-primary text-white' : 'text-text-muted hover:text-text-main hover:bg-surface-hover'
              }`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 scrollable p-6">
        {/* Overview */}
        {tab === 'Overview' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              <StatCard label="Placed" value={placementStats.totalPlaced} sub={`of ${placementStats.totalStudents}`} icon={Award} color="bg-success/15 text-success" />
              <StatCard label="Total Offers" value={placementStats.totalOffers} icon={Briefcase} color="bg-brand-secondary/15 text-brand-secondary-light" />
              <StatCard label="Companies" value={placementStats.companiesVisited} icon={Building2} color="bg-purple-500/15 text-purple-400" />
              <StatCard label="Avg CTC" value={`₹${placementStats.avgCTC}L`} icon={TrendingUp} color="bg-brand-gold/15 text-brand-gold" />
              <StatCard label="Highest CTC" value={`₹${placementStats.highestCTC}L`} icon={DollarSign} color="bg-brand-primary/15 text-brand-primary-light" />
              <StatCard label="Placement %" value={`${Math.round((placementStats.totalPlaced / placementStats.totalStudents) * 100)}%`} icon={Target} color="bg-info/15 text-info" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Monthly trend */}
              <div className="card p-5">
                <h3 className="font-semibold text-text-main mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-brand-primary" /> Monthly Placement Trend
                </h3>
                <MonthlyChart data={placementStats.monthlyTrend} />
              </div>

              {/* Branch stats */}
              <div className="card p-5">
                <h3 className="font-semibold text-text-main mb-4 flex items-center gap-2">
                  <Users className="w-4 h-4 text-brand-primary" /> Branch-wise Placement %
                </h3>
                <div className="space-y-3">
                  {placementStats.branchStats.map(b => (
                    <MiniBar key={b.branch} label={b.branch} pct={b.percentage}
                      color={b.percentage >= 60 ? 'bg-success' : b.percentage >= 30 ? 'bg-warning' : 'bg-danger'} />
                  ))}
                </div>
              </div>
            </div>

            {/* Drive funnel */}
            <div className="card p-5">
              <h3 className="font-semibold text-text-main mb-4">Placement Funnel</h3>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: 'Applied', val: placementStats.drivesFunnel.applied, color: 'bg-brand-secondary/20 text-brand-secondary-light' },
                  { label: 'Tested', val: placementStats.drivesFunnel.tested, color: 'bg-warning/20 text-warning' },
                  { label: 'Interviewing', val: placementStats.drivesFunnel.interviewing, color: 'bg-purple-500/20 text-purple-400' },
                  { label: 'Placed', val: placementStats.drivesFunnel.placed, color: 'bg-success/20 text-success' },
                ].map(f => (
                  <div key={f.label} className={`rounded-xl p-4 text-center ${f.color.split(' ')[0]}`}>
                    <p className={`text-3xl font-bold ${f.color.split(' ')[1]}`}>{f.val}</p>
                    <p className="text-xs text-text-muted mt-1">{f.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Drives */}
        {tab === 'Drives' && (
          <div className="animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {placementDrives.map(d => <DriveCard key={d.id} drive={d} />)}
            </div>
          </div>
        )}

        {/* Students (Admin only) */}
        {tab === 'Students' && isAdmin && (
          <div className="animate-fade-in space-y-4">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-faint" />
                <input value={cgpaFilter} onChange={e => setCgpaFilter(e.target.value)}
                  placeholder="Min CGPA (e.g. 7.5)" className="input pl-9" type="number" step="0.1" min="0" max="10" />
              </div>
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-faint" />
                <input value={skillFilter} onChange={e => setSkillFilter(e.target.value)}
                  placeholder="Filter by skill (e.g. React, Python)" className="input pl-9" />
              </div>
            </div>
            <p className="text-xs text-text-faint">{filteredStudents.length} of {students.length} students match</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredStudents.map(u => <StudentProfileCard key={u.uid} user={u} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
