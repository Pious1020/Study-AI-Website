import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { getFirebaseDb } from '../lib/firebase';
import { useAuth } from '../providers/AuthProvider';
import { StudySet } from '../types';
import { Loader2, Plus } from 'lucide-react';

export default function Library() {
  const [studyDecks, setStudyDecks] = useState<StudySet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    async function fetchStudyDecks() {
      if (!currentUser) {
        setStudyDecks([]);
        setLoading(false);
        return;
      }

      try {
        const db = getFirebaseDb();
        const q = query(
          collection(db, 'studyDecks'),
          where('userId', '==', currentUser.uid)
        );

        const querySnapshot = await getDocs(q);
        const decks = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as StudySet[];

        setStudyDecks(decks);
      } catch (err) {
        console.error('Error fetching study decks:', err);
        setError('Failed to load your study decks');
      } finally {
        setLoading(false);
      }
    }

    fetchStudyDecks();
  }, [currentUser]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">{error}</div>
        <Link
          to="/create"
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          Try creating a new study deck
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Study Decks</h1>
        <Link
          to="/create"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create New Deck
        </Link>
      </div>

      {studyDecks.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No study decks yet
          </h3>
          <p className="text-gray-500 mb-4">
            Create your first study deck to get started!
          </p>
          <Link
            to="/create"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Study Deck
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {studyDecks.map((deck) => (
            <Link
              key={deck.id}
              to={`/study/${deck.id}`}
              className="block bg-white overflow-hidden rounded-lg border border-gray-200 hover:border-blue-500 transition-colors duration-200"
            >
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {deck.title}
                </h3>
                <p className="text-gray-500 text-sm mb-4">
                  {deck.description || `A study deck about ${deck.subject}`}
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="mr-4">{deck.subject}</span>
                  <span className="capitalize">{deck.difficulty}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}