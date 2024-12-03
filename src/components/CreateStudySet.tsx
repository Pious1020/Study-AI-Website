import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, GraduationCap, Book, Brain, Sparkles, FileText } from 'lucide-react';
import { generateFlashcards, generateQuiz } from '../services/gemini';
import { useStudyStore } from '../store/studyStore';
import ErrorMessage from './ErrorMessage';
import { StudySet } from '../types';

interface FormData {
  topic: string;
  subject: string;
  difficulty: string;
  additionalInfo: string;
  numberOfQuestions: number;
  description: string;
}

export default function CreateStudySet() {
  const [formData, setFormData] = useState<FormData>({
    topic: '',
    subject: '',
    difficulty: 'intermediate',
    additionalInfo: '',
    numberOfQuestions: 10,
    description: '',
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

      const studySet: StudySet = {
        id: `set-${Date.now()}`,
        title: `${formData.subject}: ${formData.topic}`,
        description: formData.description || `A study set about ${formData.topic} in ${formData.subject} at ${formData.difficulty} level.`,
        flashcards,
        quiz: {
          ...quiz,
          title: `${formData.subject}: ${formData.topic} Quiz`,
        },
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
                Subject
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

            {/* Description Input */}
            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium text-apple-gray-500">
                Description
              </label>
              <div className="relative">
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="apple-input pl-10 min-h-[100px]"
                  placeholder="Add a description for your study set..."
                />
                <FileText className="absolute left-3 top-4 h-5 w-5 text-apple-gray-300" />
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
                Additional Information (Optional)
              </label>
              <textarea
                id="additionalInfo"
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleInputChange}
                className="apple-input"
                placeholder="Add any specific topics or areas you'd like to focus on..."
                rows={4}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full apple-button flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Generating Study Set...
                </>
              ) : (
                'Create Study Set'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}