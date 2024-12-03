import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStudyStore } from '../store/studyStore';
import { ChevronLeft, ChevronRight, ArrowLeft, BookOpen, PenTool } from 'lucide-react';

export default function StudySetView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const studySet = useStudyStore((state) => 
    state.studySets.find((set) => set.id === id)
  );
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showBack, setShowBack] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>([]);
  const [showResults, setShowResults] = useState(false);

  if (!studySet) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h2 className="apple-heading text-2xl mb-4">Study set not found</h2>
        <button
          onClick={() => navigate('/library')}
          className="apple-button"
        >
          Return to Library
        </button>
      </div>
    );
  }

  const currentCard = studySet.flashcards[currentCardIndex];
  const hasNextCard = currentCardIndex < studySet.flashcards.length - 1;
  const hasPrevCard = currentCardIndex > 0;

  const handleNext = () => {
    if (hasNextCard) {
      setCurrentCardIndex(prev => prev + 1);
      setShowBack(false);
    }
  };

  const handlePrev = () => {
    if (hasPrevCard) {
      setCurrentCardIndex(prev => prev - 1);
      setShowBack(false);
    }
  };

  const handleAnswerSelect = (questionIndex: number, answerIndex: number | null) => {
    setSelectedAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[questionIndex] = answerIndex;
      return newAnswers;
    });
  };

  const calculateScore = () => {
    return studySet.quiz.questions.reduce((score, question, index) => {
      return score + (selectedAnswers[index] !== null && selectedAnswers[index] === question.correctAnswer ? 1 : 0);
    }, 0);
  };

  const getAnswerStatus = (questionIndex: number, answerIndex: number) => {
    if (!showResults) return '';
    if (selectedAnswers[questionIndex] === null) return 'text-apple-gray-400';
    if (answerIndex === studySet.quiz.questions[questionIndex].correctAnswer) {
      return 'text-green-500';
    }
    if (selectedAnswers[questionIndex] === answerIndex) {
      return 'text-red-500';
    }
    return '';
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-apple-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/library')}
            className="flex items-center text-apple-gray-400 hover:text-apple-gray-500 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Library
          </button>
          <h1 className="apple-heading text-3xl mb-2">{studySet.title}</h1>
          <p className="apple-subheading">
            {studySet.subject} • {studySet.difficulty}
          </p>
        </div>

        {/* Mode Selection */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => {
              setShowQuiz(false);
              setShowResults(false);
            }}
            className={`apple-button flex items-center ${!showQuiz ? 'bg-apple-blue' : 'bg-apple-gray-500'}`}
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Flashcards
          </button>
          <button
            onClick={() => setShowQuiz(true)}
            className={`apple-button flex items-center ${showQuiz ? 'bg-apple-blue' : 'bg-apple-gray-500'}`}
          >
            <PenTool className="h-4 w-4 mr-2" />
            Quiz
          </button>
        </div>

        {/* Flashcards */}
        {!showQuiz && (
          <div className="apple-card min-h-[400px] flex flex-col">
            <div
              className="flex-1 flex items-center justify-center p-8 cursor-pointer select-none"
              onClick={() => setShowBack(!showBack)}
            >
              <div className="text-center max-w-xl">
                <h3 className="text-2xl font-medium mb-4">
                  {showBack ? currentCard.back : currentCard.front}
                </h3>
                <p className="text-apple-gray-400 text-sm">
                  Click to {showBack ? 'hide' : 'show'} answer
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 border-t border-apple-gray-100">
              <button
                onClick={handlePrev}
                disabled={!hasPrevCard}
                className="apple-button bg-apple-gray-500 disabled:opacity-50"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="text-apple-gray-400">
                {currentCardIndex + 1} / {studySet.flashcards.length}
              </span>
              <button
                onClick={handleNext}
                disabled={!hasNextCard}
                className="apple-button bg-apple-gray-500 disabled:opacity-50"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {/* Quiz */}
        {showQuiz && !showResults && (
          <div className="space-y-8">
            {studySet.quiz.questions.map((question, qIndex) => (
              <div key={qIndex} className="mb-8 last:mb-0">
                <h3 className="text-lg font-medium mb-4">
                  {qIndex + 1}. {question.question}
                </h3>
                <div className="space-y-2">
                  {question.options.map((answer, aIndex) => (
                    <button
                      key={aIndex}
                      onClick={() => !showResults && handleAnswerSelect(qIndex, aIndex)}
                      className={`w-full text-left p-4 rounded-lg border transition-all ${
                        selectedAnswers[qIndex] === aIndex
                          ? 'border-apple-blue bg-apple-blue bg-opacity-5'
                          : 'border-apple-gray-200 hover:border-apple-blue'
                      } ${getAnswerStatus(qIndex, aIndex)}`}
                      disabled={showResults}
                    >
                      {answer}
                    </button>
                  ))}
                  {!showResults && (
                    <button
                      onClick={() => handleAnswerSelect(qIndex, null)}
                      className={`w-full text-left p-4 rounded-lg border transition-all ${
                        selectedAnswers[qIndex] === null
                          ? 'border-apple-gray-400 bg-apple-gray-100'
                          : 'border-apple-gray-200 hover:border-apple-gray-400'
                      }`}
                    >
                      Skip this question
                    </button>
                  )}
                </div>
                {showResults && (
                  <div className="mt-4">
                    {selectedAnswers[qIndex] === null ? (
                      <p className="text-apple-gray-500">Question was skipped</p>
                    ) : selectedAnswers[qIndex] === question.correctAnswer ? (
                      <p className="text-green-500">Correct!</p>
                    ) : (
                      <div>
                        <p className="text-red-500">Incorrect</p>
                        <p className="text-apple-gray-500 mt-2">
                          Correct answer: {question.options[question.correctAnswer]}
                        </p>
                      </div>
                    )}
                    {question.explanation && (
                      <p className="text-apple-gray-500 mt-2">{question.explanation}</p>
                    )}
                  </div>
                )}
              </div>
            ))}
            
            <button
              onClick={() => setShowResults(true)}
              disabled={selectedAnswers.length !== studySet.quiz.questions.length}
              className="apple-button w-full"
            >
              Submit Quiz
            </button>
          </div>
        )}

        {/* Quiz Results */}
        {showQuiz && showResults && (
          <div className="space-y-8">
            <div className="apple-card text-center">
              <h3 className="text-2xl font-medium mb-2">Quiz Results</h3>
              <p className="text-4xl font-bold text-apple-blue mb-2">
                {calculateScore()} / {studySet.quiz.questions.length}
              </p>
              <p className="text-apple-gray-400">
                {Math.round((calculateScore() / studySet.quiz.questions.length) * 100)}% Correct
              </p>
            </div>

            {studySet.quiz.questions.map((question, qIndex) => (
              <div 
                key={qIndex} 
                className={`apple-card border-l-4 ${
                  selectedAnswers[qIndex] === null
                    ? 'border-l-apple-gray-400'
                    : selectedAnswers[qIndex] === question.correctAnswer
                    ? 'border-l-apple-green'
                    : 'border-l-apple-red'
                }`}
              >
                <h3 className="text-xl font-medium mb-4">{question.question}</h3>
                <div className="space-y-3 mb-4">
                  {question.options.map((option, optionIndex) => (
                    <div
                      key={optionIndex}
                      className={`p-4 rounded-apple ${
                        optionIndex === question.correctAnswer
                          ? 'bg-apple-green/5 border border-apple-green'
                          : optionIndex === selectedAnswers[qIndex]
                          ? 'bg-apple-red/5 border border-apple-red'
                          : 'border border-apple-gray-200'
                      }`}
                    >
                      {option}
                    </div>
                  ))}
                </div>
                {selectedAnswers[qIndex] === null ? (
                  <p className="text-apple-gray-500">Question was skipped</p>
                ) : selectedAnswers[qIndex] !== question.correctAnswer && (
                  <div>
                    <p className="text-red-500">Incorrect</p>
                    <p className="text-apple-gray-500 mt-2">
                      Correct answer: {question.options[question.correctAnswer]}
                    </p>
                  </div>
                )}
                {question.explanation && (
                  <p className="text-apple-gray-500 mt-2">{question.explanation}</p>
                )}
              </div>
            ))}

            <button
              onClick={() => {
                setShowResults(false);
                setSelectedAnswers([]);
              }}
              className="apple-button w-full"
            >
              Retake Quiz
            </button>
          </div>
        )}
      </div>
    </div>
  );
}