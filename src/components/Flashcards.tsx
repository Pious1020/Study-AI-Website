import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { getFirebaseDb } from '../lib/firebase';
import { ArrowLeft } from 'lucide-react';

interface Flashcard {
  question: string;
  answer: string;
}

export default function Flashcards() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFlashcards() {
      if (!id) return;
      
      try {
        const db = getFirebaseDb();
        const docRef = doc(db, 'studyDecks', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setFlashcards(data.flashcards || []);
        }
      } catch (error) {
        console.error('Error fetching flashcards:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchFlashcards();
  }, [id]);

  const goToNextCard = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
    }
  };

  const goToPreviousCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowAnswer(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-apple-blue mx-auto"></div>
        </div>
      </div>
    );
  }

  if (flashcards.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-600">No flashcards available.</p>
          <button
            onClick={() => navigate(`/study/${id}`)}
            className="mt-4 apple-button"
          >
            Back to Study Deck
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate(`/study/${id}`)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Study Deck
      </button>

      <div className="max-w-2xl mx-auto">
        <div className="apple-card min-h-[300px] flex flex-col">
          <div className="flex-grow flex flex-col items-center justify-center p-8 text-center">
            {showAnswer ? (
              <p className="text-xl">{flashcards[currentIndex].answer}</p>
            ) : (
              <p className="text-xl">{flashcards[currentIndex].question}</p>
            )}
          </div>

          <div className="border-t border-gray-200 p-4">
            <div className="flex justify-between items-center">
              <button
                onClick={goToPreviousCard}
                disabled={currentIndex === 0}
                className="apple-button disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-gray-600">
                {currentIndex + 1} / {flashcards.length}
              </span>
              <button
                onClick={goToNextCard}
                disabled={currentIndex === flashcards.length - 1}
                className="apple-button disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <button
              onClick={() => setShowAnswer(!showAnswer)}
              className="w-full mt-4 apple-button"
            >
              {showAnswer ? 'Show Question' : 'Show Answer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
