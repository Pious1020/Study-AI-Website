import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, GraduationCap, Book, Brain, Sparkles } from 'lucide-react';
import { generateFlashcards, generateQuiz } from '../services/gemini';
import { useStudyStore } from '../store/studyStore';
import ErrorMessage from './ErrorMessage';

interface FormData {
  topic: string;
  subject: string;
  difficulty: string;
  additionalInfo: string;
  numberOfQuestions: number;
}

export default function CreateStudySet() {
  const [formData, setFormData] = useState<FormData>({
    topic: '',
    subject: '',
    difficulty: 'intermediate',
    additionalInfo: '',
    numberOfQuestions: 10,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const addStudySet = useStudyStore((state) => state.addStudySet);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.type === 'number' ? parseInt(e.target.value) : e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const [flashcards, quiz] = await Promise.all([
        generateFlashcards(formData),
        generateQuiz(formData)
      ]);

      const studySet = {
        id: `set-${Date.now()}`,
        title: `${formData.subject}: ${formData.topic}`,
        topic: formData.topic,
        subject: formData.subject,
        difficulty: formData.difficulty,
        flashcards,
        quiz
      };

      addStudySet(studySet);
      navigate(`/study/${studySet.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-apple-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="apple-card space-y-8">
          {/* Header */}
          <div className="text-center">
            <GraduationCap className="h-12 w-12 text-apple-blue mx-auto mb-4" />
            <h1 className="apple-heading text-3xl mb-2">Create Study Set</h1>
            <p className="apple-subheading">
              Let AI craft the perfect study materials for you
            </p>
          </div>

          {error && <ErrorMessage message={error} />}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Topic Input */}
            <div className="space-y-2">
              <label htmlFor="topic" className="block text-sm font-medium text-apple-gray-500">
                What would you like to learn about?
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="topic"
                  name="topic"
                  value={formData.topic}
                  onChange={handleInputChange}
                  className="apple-input pl-10"
                  placeholder="e.g., Photosynthesis"
                  required
                />
                <Book className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-apple-gray-300" />
              </div>
            </div>

            {/* Subject Input */}
            <div className="space-y-2">
              <label htmlFor="subject" className="block text-sm font-medium text-apple-gray-500">
                Subject Area
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="apple-input pl-10"
                  placeholder="e.g., Biology"
                  required
                />
                <Brain className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-apple-gray-300" />
              </div>
            </div>

            {/* Difficulty Select */}
            <div className="space-y-2">
              <label htmlFor="difficulty" className="block text-sm font-medium text-apple-gray-500">
                Difficulty Level
              </label>
              <select
                id="difficulty"
                name="difficulty"
                value={formData.difficulty}
                onChange={handleInputChange}
                className="apple-input"
                required
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            {/* Number of Questions Input */}
            <div className="space-y-2">
              <label htmlFor="numberOfQuestions" className="block text-sm font-medium text-apple-gray-500">
                Number of Questions
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="numberOfQuestions"
                  name="numberOfQuestions"
                  value={formData.numberOfQuestions}
                  onChange={handleInputChange}
                  className="apple-input pl-10"
                  min="5"
                  max="100"
                  required
                />
                <Sparkles className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-apple-gray-300" />
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-2">
              <label htmlFor="additionalInfo" className="block text-sm font-medium text-apple-gray-500">
                Additional Information
              </label>
              <div className="relative">
                <textarea
                  id="additionalInfo"
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleInputChange}
                  className="apple-input min-h-[100px] pl-10"
                  placeholder="Any specific aspects you'd like to focus on?"
                />
                <Sparkles className="absolute left-3 top-4 h-5 w-5 text-apple-gray-300" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="apple-button w-full flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5" />
                  <span>Generating Study Materials...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  <span>Generate Study Materials</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}