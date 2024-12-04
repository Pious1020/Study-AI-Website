import { Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import Header from './components/Header';
import CreateStudySet from './components/CreateStudySet';
import StudySetView from './components/StudySetView';
import Library from './components/Library';
import Home from './components/Home';
import AuthProvider from './providers/AuthProvider';
import ProtectedRoute from './components/ProtectedRoute';
import AccountSettings from './components/AccountSettings';

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-apple-gray-50">
        <Header />
        <main className="pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={
              <ProtectedRoute>
                <CreateStudySet />
              </ProtectedRoute>
            } />
            <Route path="/library" element={<Library />} />
            <Route path="/study/:id" element={<StudySetView />} />
            <Route path="/account" element={
              <ProtectedRoute>
                <AccountSettings />
              </ProtectedRoute>
            } />
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        <Analytics />
      </div>
    </AuthProvider>
  );
}