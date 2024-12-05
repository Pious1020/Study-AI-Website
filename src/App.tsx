import { Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import Header from './components/Header';
import CreateStudySet from './components/CreateStudySet';
import StudySetView from './components/StudySetView';
import Library from './components/Library';
import Home from './components/Home';
import AuthProvider, { useAuth } from './providers/AuthProvider';
import ProtectedRoute from './components/ProtectedRoute';
import AccountSettings from './components/AccountSettings';
import StudyDeck from './components/StudyDeck';
import Flashcards from './components/Flashcards';
import Quiz from './components/Quiz';
import Login from './components/Login';
import ErrorBoundary from './components/ErrorBoundary';

function AppContent() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/create"
            element={
              <ProtectedRoute>
                <CreateStudySet />
              </ProtectedRoute>
            }
          />
          <Route
            path="/library"
            element={
              <ProtectedRoute>
                <Library />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <AccountSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/study/:id"
            element={
              <ProtectedRoute>
                <StudyDeck />
              </ProtectedRoute>
            }
          />
          <Route
            path="/deck/:id/flashcards"
            element={
              <ProtectedRoute>
                <Flashcards />
              </ProtectedRoute>
            }
          />
          <Route
            path="/deck/:id/quiz"
            element={
              <ProtectedRoute>
                <Quiz />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Analytics />
    </div>
  );
}

export default function App() {
  console.log('App: Rendering root component');
  
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  );
}