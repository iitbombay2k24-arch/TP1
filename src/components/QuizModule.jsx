import { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  ClipboardList, Clock, Play, CheckCircle, Lock, Trophy,
  ChevronRight, AlertTriangle, Shield, X, BarChart2,
  Target, Zap, Timer
} from 'lucide-react';

function QuizCard({ quiz, onStart, isStudent }) {
  const statusStyles = {
    live: 'tag-green',
    upcoming: 'tag-yellow',
    completed: 'text-text-faint bg-surface-hover text-xs font-medium px-2 py-0.5 rounded-md',
  };

  return (
    <div className="card-hover p-5 flex flex-col gap-4 animate-fade-in">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-text-main">{quiz.title}</h3>
          <p className="text-xs text-text-muted mt-1">{quiz.subject} · by {quiz.createdBy}</p>
        </div>
        <span className={statusStyles[quiz.status]}>{quiz.status.toUpperCase()}</span>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-surface-base rounded-lg py-2">
          <p className="text-text-main font-bold text-lg">{quiz.totalQuestions}</p>
          <p className="text-[10px] text-text-faint">Questions</p>
        </div>
        <div className="bg-surface-base rounded-lg py-2">
          <p className="text-text-main font-bold text-lg">{quiz.duration}</p>
          <p className="text-[10px] text-text-faint">Minutes</p>
        </div>
        <div className="bg-surface-base rounded-lg py-2">
          <p className="text-text-main font-bold text-lg">{quiz.negativeMarking < 0 ? quiz.negativeMarking : 'None'}</p>
          <p className="text-[10px] text-text-faint">Neg. Mark</p>
        </div>
      </div>

      {quiz.status === 'live' && isStudent && (
        <button onClick={() => onStart(quiz)} className="btn-primary flex items-center justify-center gap-2">
          <Play className="w-4 h-4" /> Start Quiz
        </button>
      )}
      {quiz.status === 'upcoming' && (
        <button disabled className="btn-secondary text-text-faint cursor-not-allowed flex items-center justify-center gap-2">
          <Timer className="w-4 h-4" /> Not yet available
        </button>
      )}
      {quiz.status === 'completed' && (
        <button className="btn-secondary flex items-center justify-center gap-2">
          <BarChart2 className="w-4 h-4 text-text-muted" /> View Results
        </button>
      )}
    </div>
  );
}

function LiveQuiz({ quiz, onExit }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(quiz.duration * 60);
  const [submitted, setSubmitted] = useState(false);
  const [tabSwitches, setTabSwitches] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [score, setScore] = useState(null);
  const intervalRef = useRef(null);

  const q = quiz.questions[currentQ];

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { handleSubmit(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        setTabSwitches(p => {
          const next = p + 1;
          if (next >= 3) {
            setShowWarning(false);
            handleSubmit();
          } else {
            setShowWarning(true);
          }
          return next;
        });
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  const handleSubmit = () => {
    clearInterval(intervalRef.current);
    let s = 0;
    quiz.questions.forEach(q => {
      if (answers[q.id] === q.correct) s += q.marks;
      else if (answers[q.id] !== undefined) s += quiz.negativeMarking;
    });
    setScore(Math.max(0, s));
    setSubmitted(true);
  };

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  const pct = (timeLeft / (quiz.duration * 60)) * 100;

  if (submitted) {
    const total = quiz.questions.reduce((a, q) => a + q.marks, 0);
    const pctScore = ((score / total) * 100).toFixed(0);
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-lg card p-8 text-center animate-slide-up">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
            pctScore >= 80 ? 'bg-success/20' : pctScore >= 50 ? 'bg-warning/20' : 'bg-danger/20'
          }`}>
            <Trophy className={`w-10 h-10 ${pctScore >= 80 ? 'text-success' : pctScore >= 50 ? 'text-warning' : 'text-danger'}`} />
          </div>
          <h2 className="text-2xl font-bold text-text-main">{pctScore}%</h2>
          <p className="text-text-muted mt-1">Score: {score} / {total}</p>
          <div className="progress-bar my-4">
            <div className="progress-fill bg-gradient-to-r from-brand-primary to-brand-primary-light" style={{ width: `${pctScore}%` }} />
          </div>
          <div className="space-y-3 text-left mt-6">
            {quiz.questions.map((q, i) => {
              const ans = answers[q.id];
              const correct = ans === q.correct;
              return (
                <div key={q.id} className={`p-3 rounded-lg border ${correct ? 'border-success/30 bg-success/5' : 'border-danger/30 bg-danger/5'}`}>
                  <p className="text-sm font-medium text-text-main">{i + 1}. {q.text}</p>
                  <p className={`text-xs mt-1 ${correct ? 'text-success' : 'text-danger'}`}>
                    {correct ? '✓ Correct' : `✗ Your answer: ${ans !== undefined ? q.options[ans] : 'Not answered'}`}
                  </p>
                  {!correct && <p className="text-xs text-text-faint mt-0.5">Correct: {q.options[q.correct]}</p>}
                  <p className="text-xs text-brand-secondary-light mt-1">💡 {q.explanation}</p>
                </div>
              );
            })}
          </div>
          <button onClick={onExit} className="btn-primary mt-6 w-full">Back to Quizzes</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-surface-base"
      onCopy={e => e.preventDefault()}
      onCut={e => e.preventDefault()}
      onPaste={e => e.preventDefault()}>

      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3 bg-surface-panel border-b border-border-subtle flex-shrink-0">
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-brand-primary" />
          <span className="text-sm font-semibold text-text-main">{quiz.title}</span>
          <span className="tag-red flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />LIVE</span>
        </div>
        <div className="flex items-center gap-4">
          {tabSwitches > 0 && (
            <span className="text-xs text-warning flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" /> {tabSwitches}/3 tab switches
            </span>
          )}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono font-bold text-sm ${
            timeLeft < 60 ? 'bg-danger/20 text-danger' : 'bg-surface-base text-text-main'
          }`}>
            <Clock className="w-4 h-4" />
            {formatTime(timeLeft)}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="progress-bar h-1 rounded-none flex-shrink-0">
        <div className="progress-fill bg-gradient-to-r from-brand-primary to-brand-primary-light transition-all duration-1000"
          style={{ width: `${pct}%` }} />
      </div>

      {showWarning && (
        <div className="flex items-center gap-3 px-6 py-2 bg-danger/10 border-b border-danger/30 animate-fade-in">
          <AlertTriangle className="w-4 h-4 text-danger flex-shrink-0" />
          <span className="text-danger text-sm font-medium">⚠️ Tab switch detected! 3 switches will auto-submit your exam.</span>
          <button onClick={() => setShowWarning(false)} className="ml-auto text-danger hover:text-text-main"><X className="w-4 h-4" /></button>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        {/* Question nav sidebar */}
        <div className="w-48 border-r border-border-subtle bg-surface-panel p-3 scrollable flex-shrink-0">
          <p className="text-xs text-text-faint mb-2 font-medium">Questions</p>
          <div className="grid grid-cols-4 gap-1.5">
            {quiz.questions.map((q, i) => (
              <button key={q.id} onClick={() => setCurrentQ(i)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                  i === currentQ ? 'bg-brand-primary text-white' :
                  answers[q.id] !== undefined ? 'bg-success/20 text-success' :
                  'bg-surface-hover text-text-faint hover:bg-surface-active'
                }`}>
                {i + 1}
              </button>
            ))}
          </div>
          <div className="mt-4 space-y-1.5 text-[10px] text-text-faint">
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-brand-primary" />Current</div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-success/20" />Answered</div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-surface-hover" />Unanswered</div>
          </div>
        </div>

        {/* Question area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 scrollable p-6">
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center gap-2 mb-4">
                <span className="tag-blue">Q{currentQ + 1} / {quiz.questions.length}</span>
                <span className="tag-yellow">{q.marks} mark{q.marks > 1 ? 's' : ''}</span>
              </div>
              <h3 className="text-lg font-semibold text-text-main mb-6 leading-relaxed">{q.text}</h3>

              <div className="space-y-3">
                {q.options.map((opt, idx) => (
                  <button key={idx} onClick={() => setAnswers(p => ({ ...p, [q.id]: idx }))}
                    className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all duration-150 text-sm font-medium ${
                      answers[q.id] === idx
                        ? 'border-brand-primary bg-brand-primary/10 text-text-main'
                        : 'border-border-subtle bg-surface-hover/50 text-text-muted hover:border-border-medium hover:text-text-main'
                    }`}>
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full border mr-3 text-xs font-bold border-current">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between px-6 py-4 border-t border-border-subtle bg-surface-panel flex-shrink-0">
            <button onClick={() => setCurrentQ(p => Math.max(0, p - 1))} disabled={currentQ === 0}
              className="btn-secondary disabled:opacity-40">← Prev</button>
            <button onClick={handleSubmit} className="btn-danger">Submit Exam</button>
            {currentQ < quiz.questions.length - 1 ? (
              <button onClick={() => setCurrentQ(p => p + 1)} className="btn-secondary">Next →</button>
            ) : (
              <button onClick={handleSubmit} className="btn-primary">Finish</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function QuizModule() {
  const { quizzes, currentUser } = useApp();
  const [activeQuiz, setActiveQuiz] = useState(null);
  const isStudent = currentUser?.role === 'Student';

  if (activeQuiz) return <LiveQuiz quiz={activeQuiz} onExit={() => setActiveQuiz(null)} />;

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <div className="px-6 py-4 border-b border-border-subtle bg-surface-panel/60 backdrop-blur-sm flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-text-main flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-brand-primary" /> Quiz & Assessments
            </h1>
            <p className="text-xs text-text-muted mt-0.5">Live quizzes, mock tests, and placement prep assessments</p>
          </div>
          {!isStudent && (
            <button className="btn-primary flex items-center gap-2 text-sm">
              <Zap className="w-4 h-4" /> Create Quiz
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 scrollable p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quizzes.map(q => (
            <QuizCard key={q.id} quiz={q} onStart={setActiveQuiz} isStudent={isStudent} />
          ))}
        </div>
      </div>
    </div>
  );
}
