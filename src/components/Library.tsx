import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudyStore } from '../store/studyStore';
import StudySetCard from './StudySetCard';
import { PlusCircle, LogIn } from 'lucide-react';
import { useAuth0 } from '@auth0/auth0-react';

export default function Library() {
  const studySets = useStudyStore((state) => state.studySets);
  const navigate = useNavigate();
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-apple-gray-900">My Study Sets</h1>
        {isAuthenticated ? (
          <button
            onClick={() => navigate('/create')}
            className="apple-button inline-flex items-center"
          >
            <PlusCircle className="mr-2 h-5 w-5" />
            Create New
          </button>
        ) : (
          <button
            onClick={() => loginWithRedirect()}
            className="apple-button-secondary inline-flex items-center"
          >
            <LogIn className="mr-2 h-5 w-5" />
            Sign in to Create
          </button>
        )}
      </div>
      
      {!isAuthenticated ? (
        <div className="apple-card text-center py-12">
          <LogIn className="h-12 w-12 text-apple-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-medium text-apple-gray-900 mb-2">
            Sign in to Save Your Study Sets
          </h2>
          <p className="text-apple-gray-500 mb-6">
            Create and save your study sets to access them anytime, anywhere.
          </p>
          <button
            onClick={() => loginWithRedirect()}
            className="apple-button"
          >
            Sign In
          </button>
        </div>
      ) : studySets.length === 0 ? (
        <div className="apple-card text-center py-12">
          <PlusCircle className="h-12 w-12 text-apple-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-medium text-apple-gray-900 mb-2">
            Create Your First Study Set
          </h2>
          <p className="text-apple-gray-500 mb-6">
            Start by creating a new study set with flashcards and quizzes.
          </p>
          <button
            onClick={() => navigate('/create')}
            className="apple-button"
          >
            Create Study Set
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {studySets.map((studySet) => (
            <StudySetCard
              key={studySet.id}
              studySet={studySet}
              onClick={() => navigate(`/study/${studySet.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}