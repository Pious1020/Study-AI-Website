import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addDoc, collection } from 'firebase/firestore';
import { getFirebaseDb } from '../lib/firebase';
import { useAuth } from '../providers/AuthProvider';
import { generateFlashcards, generateTitle, generateQuizOptions } from '../services/gemini';
import { studyDeckService } from '../services/studyDeck';
import { Wand2, Trash2 } from 'lucide-react';

interface FormData {
  title: string;
  description: string;
  subject: string;
  topic: string;
  difficulty: string;
  numberOfQuestions: number;
  additionalInfo?: string;
}

export default function CreateStudySet() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { id } = useParams(); // Get deck ID if we're editing
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    subject: '',
    topic: '',
    difficulty: 'intermediate',
    numberOfQuestions: 5,
    additionalInfo: '',
  });

  const generateTitleHandler = async () => {
    if (!formData.subject || !formData.topic) {
      setError('Please enter subject and topic first');
      return;
    }

    try {
      setLoading(true);
      const title = await generateTitle(formData.subject, formData.topic);
      setFormData(prev => ({ ...prev, title }));
      setError(null);
    } catch (error) {
      console.error('Error generating title:', error);
      setError('Failed to generate title. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      setError('You must be logged in to create a study set');
      return;
    }

    if (!formData.title || !formData.subject || !formData.topic) {
      setError('Please fill in all required fields');
      return;
    }

    if (loading) {
      return; // Prevent multiple submissions
    }

    setLoading(true);
    setError(null);

    try {
      // First generate flashcards
      const flashcards = await generateFlashcards(formData);
      
      // Then generate quiz questions with options
      const quizQuestions = await Promise.all(
        flashcards.map(async card => {
          const options = await generateQuizOptions(card.question, card.answer);
          return {
            question: card.question,
            options,
            correctAnswer: card.answer,
            explanation: `The correct answer is: ${card.answer}`
          };
        })
      );

      // Finally, save everything to Firestore
      const db = getFirebaseDb();
      const studyDeckRef = await addDoc(collection(db, 'studyDecks'), {
        ...formData,
        userId: currentUser.uid,
        createdAt: new Date().toISOString(),
        flashcards,
        quiz: {
          questions: quizQuestions,
        },
      });

      // Navigate only after everything is saved
      navigate(`/study/${studyDeckRef.id}`);
    } catch (err) {
      console.error('Error creating study set:', err);
      setError('Failed to create study set. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    
    if (!window.confirm('Are you sure you want to delete this study set? This action cannot be undone.')) {
      return;
    }

    try {
      setLoading(true);
      await studyDeckService.deleteDeck(id);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error deleting study set:', error);
      setError('Failed to delete study set. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{id ? 'Edit Study Set' : 'Create Study Set'}</h1>
        {id && (
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-2 disabled:opacity-50"
            disabled={loading}
          >
            <Trash2 className="w-4 h-4" />
            Delete Set
          </button>
        )}
      </div>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="apple-card">
          <div className="space-y-6">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="flex gap-4 items-end">
                  <div className="flex-grow">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-apple-blue focus:border-transparent transition-shadow"
                      placeholder="Enter a title for your study set"
                      required
                    />
                  </div>
                  <button
                    type="button"
                    onClick={generateTitleHandler}
                    disabled={loading}
                    className="apple-button-secondary flex items-center gap-2 h-[42px]"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                    ) : (
                      <Wand2 className="w-4 h-4" />
                    )}
                    Generate
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={e => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-apple-blue focus:border-transparent transition-shadow"
                    placeholder="e.g., Mathematics, History, Science"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Topic
                  </label>
                  <input
                    type="text"
                    value={formData.topic}
                    onChange={e => setFormData(prev => ({ ...prev, topic: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-apple-blue focus:border-transparent transition-shadow"
                    placeholder="e.g., Calculus, World War II, Chemistry"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-apple-blue focus:border-transparent transition-shadow"
                    placeholder="Describe what this study set covers"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Difficulty Level
                    </label>
                    <select
                      value={formData.difficulty}
                      onChange={e => setFormData(prev => ({ ...prev, difficulty: e.target.value }))}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-apple-blue focus:border-transparent transition-shadow"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Number of Questions
                    </label>
                    <select
                      value={formData.numberOfQuestions}
                      onChange={e => setFormData(prev => ({ ...prev, numberOfQuestions: Number(e.target.value) }))}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-apple-blue focus:border-transparent transition-shadow"
                    >
                      {[5, 10, 15, 20].map(num => (
                        <option key={num} value={num}>
                          {num} questions
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Information (Optional)
                  </label>
                  <textarea
                    value={formData.additionalInfo}
                    onChange={e => setFormData(prev => ({ ...prev, additionalInfo: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-apple-blue focus:border-transparent transition-shadow"
                    placeholder="Any specific areas to focus on or additional context"
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => navigate('/library')}
                  className="apple-button-secondary"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !formData.title || !formData.subject || !formData.topic}
                  className={`apple-button ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Creating...
                    </div>
                  ) : (
                    'Create Study Set'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}