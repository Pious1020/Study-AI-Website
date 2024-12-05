import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { getFirebaseDb } from '../lib/firebase';
import { ArrowLeft } from 'lucide-react';

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export default function Quiz() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQuiz() {
      if (!id) return;
      
      try {
        const db = getFirebaseDb();
        const docRef = doc(db, 'studyDecks', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setQuestions(data.quiz?.questions || []);
        }
      } catch (error) {
        console.error('Error fetching quiz:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchQuiz();
  }, [id]);

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleNext = () => {
    if (selectedAnswer === questions[currentIndex].correctAnswer) {
      setScore(score + 1);
    }
    
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
    } else {
      setShowResult(true);
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

  if (questions.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-600">No quiz questions available.</p>
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

  if (showResult) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="apple-card text-center">
            <h2 className="text-2xl font-semibold mb-4">Quiz Complete!</h2>
            <p className="text-xl mb-4">
              Your score: {score} out of {questions.length}
            </p>
            <p className="text-lg mb-6">
              {((score / questions.length) * 100).toFixed(1)}%
            </p>
            <button
              onClick={() => navigate(`/study/${id}`)}
              className="apple-button"
            >
              Back to Study Deck
            </button>
          </div>
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
        <div className="apple-card">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Question {currentIndex + 1}</h2>
              <span className="text-gray-600">
                {currentIndex + 1} / {questions.length}
              </span>
            </div>
            <p className="text-lg">{questions[currentIndex].question}</p>
          </div>

          <div className="space-y-3">
            {questions[currentIndex].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                className={`w-full p-4 text-left rounded-lg transition-colors ${
                  selectedAnswer === option
                    ? 'bg-apple-blue text-white'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={!selectedAnswer}
            className="w-full mt-6 apple-button disabled:opacity-50"
          >
            {currentIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
          </button>
        </div>
      </div>
    </div>
  );
}
