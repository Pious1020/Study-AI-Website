import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudyStore } from '../store/studyStore';
import StudySetCard from './StudySetCard';
import { PlusCircle } from 'lucide-react';

export default function Library() {
  const studySets = useStudyStore((state) => state.studySets);
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Study Sets</h1>
        <button
          onClick={() => navigate('/create')}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          Create New
        </button>
      </div>
      
      {studySets.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">You haven't created any study sets yet.</p>
          <button
            onClick={() => navigate('/create')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-black bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Create Your First Study Set
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