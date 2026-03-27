import { useApp } from './context/AppContext';
import LoginScreen from './components/LoginScreen';
import AppShell from './components/AppShell';
import ChatWindow from './components/ChatWindow';
import DirectMessages from './components/DirectMessages';
import ResourceLibrary from './components/ResourceLibrary';
import QuizModule from './components/QuizModule';
import PlacementModule from './components/PlacementModule';
import AttendanceModule from './components/AttendanceModule';
import AdminPanel from './components/AdminPanel';

function MainContent() {
  const { currentView } = useApp();

  switch (currentView) {
    case 'chat':       return <ChatWindow />;
    case 'dms':        return <DirectMessages />;
    case 'resources':  return <ResourceLibrary />;
    case 'quiz':       return <QuizModule />;
    case 'placement':  return <PlacementModule />;
    case 'attendance': return <AttendanceModule />;
    case 'admin':      return <AdminPanel />;
    default:           return <ChatWindow />;
  }
}

export default function App() {
  const { currentUser } = useApp();

  if (!currentUser) return <LoginScreen />;

  return (
    <AppShell>
      <MainContent />
    </AppShell>
  );
}
