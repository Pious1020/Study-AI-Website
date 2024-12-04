import React from 'react';
import { BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Props {
  id: string;
  title: string;
  description: string;
  subject: string;
  flashcardCount: number;
  quizCount: number;
}

export default function StudySetCard({ 
  id, 
  title = 'Untitled Set',
  description = 'No description',
  subject = 'General',
  flashcardCount = 0,
  quizCount = 0,
}: Props) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/deck/${id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 cursor-pointer"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
          <p className="mt-1 text-sm text-gray-400">{subject}</p>
        </div>
        <BookOpen className="h-6 w-6 text-gray-400" />
      </div>
      <div className="mt-4 flex items-center space-x-4">
        <div className="text-sm text-gray-500">
          {flashcardCount} Flashcards
        </div>
        <div className="text-sm text-gray-500">
          {quizCount} Quiz Questions
        </div>
      </div>
    </div>
  );
}