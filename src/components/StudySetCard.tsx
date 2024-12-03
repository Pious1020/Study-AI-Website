import React from 'react';
import { StudySet } from '../types';
import { BookOpen } from 'lucide-react';

interface Props {
  studySet: StudySet;
  onClick: () => void;
}

export default function StudySetCard({ studySet, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 cursor-pointer"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{studySet.title}</h3>
          <p className="mt-1 text-sm text-gray-500">{studySet.description}</p>
        </div>
        <BookOpen className="h-6 w-6 text-gray-400" />
      </div>
      <div className="mt-4 flex items-center space-x-4">
        <div className="text-sm text-gray-500">
          {studySet.flashcards.length} Flashcards
        </div>
        <div className="text-sm text-gray-500">
          {studySet.quiz.questions.length} Quiz Questions
        </div>
      </div>
    </div>
  );
}