import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import StudySetCard from './StudySetCard';

interface StudyDeck {
  id: string;
  title: string;
  description: string;
  subject: string;
  flashcards: Array<{ question: string; answer: string }>;
  quiz: Array<{ question: string; options: string[]; correctAnswer: string }>;
}

export default function Library() {
  const { user, isAuthenticated, loginWithRedirect } = useAuth0();
  const [decks, setDecks] = useState<StudyDeck[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDecks() {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        const q = query(
          collection(db, 'studyDecks'),
          where('userId', '==', user.sub)
        );
        
        const querySnapshot = await getDocs(q);
        const loadedDecks = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as StudyDeck[];
        
        setDecks(loadedDecks);
      } catch (err) {
        console.error('Error loading decks:', err);
        setError('Failed to load your study decks');
      } finally {
        setLoading(false);
      }
    }

    loadDecks();
  }, [user]);

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Your Study Library</h1>
          <p className="text-gray-600 mb-6">Sign in to create and save your study sets</p>
          <button
            onClick={() => loginWithRedirect()}
            className="bg-apple-blue text-white px-6 py-2 rounded-lg hover:bg-apple-blue/90 transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Study Library</h1>
        <Link
          to="/create"
          className="bg-apple-blue text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-apple-blue/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create New Set
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-apple-blue mx-auto"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center py-8">{error}</div>
      ) : decks.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">You haven't created any study sets yet</p>
          <Link
            to="/create"
            className="text-apple-blue hover:underline"
          >
            Create your first study set
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {decks.map((deck) => (
            <StudySetCard
              key={deck.id}
              id={deck.id}
              title={deck.title}
              description={deck.description}
              subject={deck.subject}
              flashcardCount={deck.flashcards.length}
              quizCount={deck.quiz.length}
            />
          ))}
        </div>
      )}
    </div>
  );
}