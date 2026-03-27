import { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  BookOpen, Download, Search, Filter, FileText, Film, Presentation,
  Tag, Eye, Upload, Clock, User, ChevronDown, X, Bookmark
} from 'lucide-react';

const TYPE_ICONS = {
  PDF: FileText,
  Video: Film,
  Slides: Presentation,
};

const TYPE_COLORS = {
  PDF: 'text-red-400 bg-red-400/10',
  Video: 'text-purple-400 bg-purple-400/10',
  Slides: 'text-orange-400 bg-orange-400/10',
};

function ResourceCard({ r, onClick }) {
  const Icon = TYPE_ICONS[r.type] || FileText;
  const colorClass = TYPE_COLORS[r.type] || 'text-text-muted bg-surface-hover';
  const uploadDate = r.uploadedAt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <button onClick={onClick}
      className="card-hover text-left p-4 flex flex-col gap-3 animate-fade-in transition-transform hover:-translate-y-0.5 duration-200">
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${colorClass}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-text-main leading-snug line-clamp-2">{r.title}</h3>
          <p className="text-xs text-text-faint mt-0.5">{r.subject}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1">
        {r.tags.slice(0, 3).map(tag => (
          <span key={tag} className="tag-blue text-[10px]">{tag}</span>
        ))}
      </div>

      <div className="flex items-center justify-between text-xs text-text-faint pt-1 border-t border-border-subtle">
        <div className="flex items-center gap-1">
          <User className="w-3 h-3" />
          <span className="truncate max-w-[100px]">{r.uploadedBy.split(' ').slice(-1)[0]}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {uploadDate}
        </div>
        <div className="flex items-center gap-1">
          <Download className="w-3 h-3" />
          {r.downloadCount}
        </div>
      </div>
    </button>
  );
}

function ResourceModal({ resource, onClose }) {
  if (!resource) return null;
  const Icon = TYPE_ICONS[resource.type] || FileText;
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="w-full max-w-lg card shadow-panel animate-slide-up" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-border-subtle">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${TYPE_COLORS[resource.type] || 'text-text-muted bg-surface-hover'}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-text-main text-sm">{resource.title}</h3>
              <p className="text-xs text-text-faint">{resource.subject} · {resource.type} · {resource.size}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-text-faint hover:text-text-main transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 space-y-3">
          <div className="flex flex-wrap gap-1.5">
            {resource.tags.map(t => <span key={t} className="tag-blue">{t}</span>)}
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-surface-base rounded-lg p-3">
              <p className="text-text-faint text-xs mb-1">Uploaded by</p>
              <p className="text-text-main font-medium">{resource.uploadedBy}</p>
            </div>
            <div className="bg-surface-base rounded-lg p-3">
              <p className="text-text-faint text-xs mb-1">Downloads</p>
              <p className="text-text-main font-medium">{resource.downloadCount} times</p>
            </div>
            <div className="bg-surface-base rounded-lg p-3">
              <p className="text-text-faint text-xs mb-1">File Size</p>
              <p className="text-text-main font-medium">{resource.size}</p>
            </div>
            <div className="bg-surface-base rounded-lg p-3">
              <p className="text-text-faint text-xs mb-1">Uploaded on</p>
              <p className="text-text-main font-medium">{resource.uploadedAt.toLocaleDateString('en-IN')}</p>
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <button className="btn-primary flex items-center gap-2 flex-1 justify-center">
              <Download className="w-4 h-4" /> Download
            </button>
            <button className="btn-secondary flex items-center gap-2">
              <Bookmark className="w-4 h-4" /> Bookmark
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function UploadModal({ onClose }) {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [type, setType] = useState('PDF');
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="w-full max-w-md card shadow-panel animate-slide-up" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-border-subtle">
          <h3 className="font-semibold text-text-main">Upload Resource</h3>
          <button onClick={onClose}><X className="w-5 h-5 text-text-faint hover:text-text-main" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-sm text-text-muted mb-1.5">Resource Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. DSA Notes Chapter 5" className="input" />
          </div>
          <div>
            <label className="block text-sm text-text-muted mb-1.5">Subject</label>
            <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="e.g. DSA, OS, Aptitude" className="input" />
          </div>
          <div>
            <label className="block text-sm text-text-muted mb-1.5">Type</label>
            <select value={type} onChange={e => setType(e.target.value)} className="input">
              <option>PDF</option><option>Video</option><option>Slides</option>
            </select>
          </div>
          <div className="border-2 border-dashed border-border-medium rounded-xl p-8 text-center hover:border-brand-primary/50 transition-colors cursor-pointer">
            <Upload className="w-8 h-8 text-text-faint mx-auto mb-2" />
            <p className="text-sm text-text-muted">Drag & drop or click to browse</p>
            <p className="text-xs text-text-faint mt-1">PDF, PPT up to 50MB</p>
          </div>
          <button onClick={onClose} className="btn-primary w-full">Upload Resource</button>
        </div>
      </div>
    </div>
  );
}

export default function ResourceLibrary() {
  const { resources, currentUser } = useApp();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [selected, setSelected] = useState(null);
  const [showUpload, setShowUpload] = useState(false);

  const types = ['All', 'PDF', 'Video', 'Slides'];
  const filtered = resources.filter(r => {
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.subject.toLowerCase().includes(search.toLowerCase()) ||
      r.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchType = typeFilter === 'All' || r.type === typeFilter;
    return matchSearch && matchType;
  });

  const isFaculty = ['Admin', 'Faculty'].includes(currentUser?.role);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border-subtle bg-surface-panel/60 backdrop-blur-sm flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-text-main flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-brand-primary" /> Resource Library
            </h1>
            <p className="text-xs text-text-muted mt-0.5">{resources.length} resources · {resources.reduce((a, r) => a + r.downloadCount, 0)} total downloads</p>
          </div>
          {isFaculty && (
            <button onClick={() => setShowUpload(true)} className="btn-primary flex items-center gap-2 text-sm">
              <Upload className="w-4 h-4" /> Upload
            </button>
          )}
        </div>

        <div className="flex gap-3 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-faint" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by title, subject, or tag…"
              className="input pl-9" />
          </div>
          <div className="flex gap-1">
            {types.map(t => (
              <button key={t} onClick={() => setTypeFilter(t)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${typeFilter === t ? 'bg-brand-primary text-white' : 'btn-secondary'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 scrollable p-6">
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Search className="w-12 h-12 text-text-faint mx-auto mb-3" />
            <p className="text-text-muted font-medium">No resources found</p>
            <p className="text-text-faint text-sm mt-1">Try a different search term or filter</p>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(r => (
            <ResourceCard key={r.id} r={r} onClick={() => setSelected(r)} />
          ))}
        </div>
      </div>

      {selected && <ResourceModal resource={selected} onClose={() => setSelected(null)} />}
      {showUpload && <UploadModal onClose={() => setShowUpload(false)} />}
    </div>
  );
}
