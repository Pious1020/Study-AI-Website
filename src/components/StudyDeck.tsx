import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { getFirebaseDb } from '../lib/firebase';
import { ArrowLeft, BookOpen, Brain } from 'lucide-react';

interface StudyDeckData {
  title: string;
  description: string;
  subject: string;
  flashcards: Array<{ question: string; answer: string }>;
  quiz?: {
    questions: Array<{
      question: string;
      options: string[];
      correctAnswer: string;
    }>;
  };
}

export default function StudyDeck() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [studyDeck, setStudyDeck] = useState<StudyDeckData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStudyDeck() {
      if (!id) {
        setError('No study deck ID provided');
        setLoading(false);
        return;
      }

      try {
        const db = getFirebaseDb();
        const docRef = doc(db, 'studyDecks', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setStudyDeck(docSnap.data() as StudyDeckData);
        } else {
          setError('Study deck not found');
        }
      } catch (err) {
        console.error('Error fetching study deck:', err);
        setError('Failed to load study deck');
      } finally {
        setLoading(false);
      }
    }

    fetchStudyDeck();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-apple-blue mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error || !studyDeck) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-500">{error || 'Failed to load study deck'}</p>
          <button
            onClick={() => navigate('/library')}
            className="mt-4 apple-button"
          >
            Return to Library
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/library')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Library
      </button>

      <div className="apple-card">
        <h1 className="apple-heading">{studyDeck.title}</h1>
        <p className="mt-2 text-gray-600">{studyDeck.description}</p>
        <p className="mt-1 text-sm text-gray-500">{studyDeck.subject}</p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="w-6 h-6 text-apple-blue" />
              <h2 className="text-xl font-semibold">Flashcards</h2>
            </div>
            <p className="text-gray-600">{studyDeck.flashcards?.length || 0} cards available</p>
            <button
              onClick={() => navigate(`/deck/${id}/flashcards`)}
              className="mt-4 apple-button"
            >
              Study Flashcards
            </button>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Brain className="w-6 h-6 text-apple-blue" />
              <h2 className="text-xl font-semibold">Quiz</h2>
            </div>
            <p className="text-gray-600">{studyDeck.quiz?.questions?.length || 0} questions available</p>
            <button
              onClick={() => navigate(`/deck/${id}/quiz`)}
              className="mt-4 apple-button"
            >
              Take Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
