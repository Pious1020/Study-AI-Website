import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Brain, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section */}
      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
          <h1 className="apple-heading text-6xl mb-6 tracking-tight">
            Study
            <span className="bg-gradient-to-r from-apple-blue via-apple-purple to-apple-pink bg-clip-text text-transparent"> AI</span>
          </h1>
          <p className="apple-subheading max-w-2xl mx-auto mb-12">
            Revolutionary learning experience powered by artificial intelligence.
            Transform the way you study, forever.
          </p>
          <div className="flex justify-center space-x-6">
            <Link 
              to="/create" 
              className="apple-button px-8 py-4 text-lg"
            >
              Create Study Set
            </Link>
            <Link 
              to="/library" 
              className="apple-button bg-apple-gray-500 hover:bg-apple-gray-400 px-8 py-4 text-lg"
            >
              View Library
            </Link>
          </div>
        </div>

        {/* Floating Cards */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="apple-card float" style={{ animationDelay: '0s' }}>
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-apple-blue/10 mb-6">
              <Sparkles className="h-6 w-6 text-apple-blue" />
            </div>
            <h3 className="text-xl font-semibold mb-3">AI-Powered Learning</h3>
            <p className="text-apple-gray-400 leading-relaxed">
              Harness the power of artificial intelligence to create personalized study materials.
            </p>
          </div>
          
          <div className="apple-card float" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-apple-purple/10 mb-6">
              <Brain className="h-6 w-6 text-apple-purple" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Smart Flashcards</h3>
            <p className="text-apple-gray-400 leading-relaxed">
              Generate comprehensive flashcards that adapt to your learning style.
            </p>
          </div>
          
          <div className="apple-card float" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-apple-orange/10 mb-6">
              <Zap className="h-6 w-6 text-apple-orange" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Instant Insights</h3>
            <p className="text-apple-gray-400 leading-relaxed">
              Get immediate feedback and explanations to accelerate your understanding.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}