import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import CreateStudySet from './components/CreateStudySet';
import StudySetView from './components/StudySetView';
import Library from './components/Library';
import Home from './components/Home';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-apple-gray-50">
        <Header />
        <main className="pt-16"> 
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<CreateStudySet />} />
            <Route path="/library" element={<Library />} />
            <Route path="/study/:id" element={<StudySetView />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}