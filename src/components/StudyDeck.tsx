import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
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
  const { deckId } = useParams();
  const navigate = useNavigate();
  const [deck, setDeck] = useState<StudyDeckData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDeck() {
      if (!deckId) {
        setError('No deck ID provided');
        setLoading(false);
        return;
      }

      try {
        const deckRef = doc(db, 'studyDecks', deckId);
        const deckSnap = await getDoc(deckRef);

        if (!deckSnap.exists()) {
          setError('Study deck not found');
          setLoading(false);
          return;
        }

        const deckData = deckSnap.data() as StudyDeckData;
        setDeck(deckData);
      } catch (err) {
        console.error('Error loading deck:', err);
        setError('Failed to load study deck');
      } finally {
        setLoading(false);
      }
    }

    loadDeck();
  }, [deckId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-apple-blue mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error || !deck) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-500">{error || 'Failed to load study deck'}</p>
          <button
            onClick={() => navigate('/library')}
            className="mt-4 text-apple-blue hover:underline"
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

      <div className="bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900">{deck.title}</h1>
        <p className="mt-2 text-gray-600">{deck.description}</p>
        <p className="mt-1 text-sm text-gray-500">{deck.subject}</p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="w-6 h-6 text-apple-blue" />
              <h2 className="text-xl font-semibold">Flashcards</h2>
            </div>
            <p className="text-gray-600">{deck.flashcards?.length || 0} cards available</p>
            <button
              onClick={() => navigate(`/deck/${deckId}/flashcards`)}
              className="mt-4 w-full bg-apple-blue text-white px-4 py-2 rounded-lg hover:bg-apple-blue/90 transition-colors"
            >
              Study Flashcards
            </button>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Brain className="w-6 h-6 text-apple-blue" />
              <h2 className="text-xl font-semibold">Quiz</h2>
            </div>
            <p className="text-gray-600">{deck.quiz?.questions?.length || 0} questions available</p>
            <button
              onClick={() => navigate(`/deck/${deckId}/quiz`)}
              className="mt-4 w-full bg-apple-blue text-white px-4 py-2 rounded-lg hover:bg-apple-blue/90 transition-colors"
            >
              Take Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
