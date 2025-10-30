'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '../../lib/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../lib/ui/card';
import { X, ArrowRight, ArrowLeft, Trophy, Target, Upload, Users, CheckCircle } from 'lucide-react';

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({ isOpen, onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const steps: TutorialStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to VulHub!',
      description: 'Your cybersecurity learning journey starts here',
      icon: <Trophy className="h-8 w-8 text-green-400" />,
      content: (
        <div className="text-center space-y-4">
          <p className="text-gray-300 font-mono">
            Welcome to the ultimate cybersecurity learning platform! Here you'll compete, learn, and grow through real-world vulnerability challenges.
          </p>
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <p className="text-green-400 font-mono text-sm">
              🎯 Complete challenges to earn points<br/>
              🏆 Climb the leaderboard rankings<br/>
              📸 Submit proof of your achievements<br/>
              👥 Learn from the community
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'challenges',
      title: 'Finding Challenges',
      description: 'How to discover and select activities',
      icon: <Target className="h-8 w-8 text-blue-400" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-300 font-mono">
            Navigate to the <strong className="text-green-400">Challenges</strong> section to find available activities.
          </p>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-400 text-sm font-mono">1</span>
              </div>
              <div>
                <p className="text-gray-300 font-mono text-sm">
                  <strong className="text-green-400">Browse by difficulty:</strong> Beginner, Intermediate, Advanced
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-400 text-sm font-mono">2</span>
              </div>
              <div>
                <p className="text-gray-300 font-mono text-sm">
                  <strong className="text-green-400">Check requirements:</strong> What you need to complete the challenge
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-400 text-sm font-mono">3</span>
              </div>
              <div>
                <p className="text-gray-300 font-mono text-sm">
                  <strong className="text-green-400">Note the points:</strong> How many points you'll earn
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'submissions',
      title: 'Submitting Proof',
      description: 'How to submit your completed challenges',
      icon: <Upload className="h-8 w-8 text-yellow-400" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-300 font-mono">
            After completing a challenge, submit proof to earn points and climb the leaderboard.
          </p>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-yellow-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-yellow-400 text-sm font-mono">1</span>
              </div>
              <div>
                <p className="text-gray-300 font-mono text-sm">
                  <strong className="text-green-400">Take screenshots:</strong> Capture your successful completion
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-yellow-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-yellow-400 text-sm font-mono">2</span>
              </div>
              <div>
                <p className="text-gray-300 font-mono text-sm">
                  <strong className="text-green-400">Upload files:</strong> Images, text files, or other proof
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-yellow-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-yellow-400 text-sm font-mono">3</span>
              </div>
              <div>
                <p className="text-gray-300 font-mono text-sm">
                  <strong className="text-green-400">Add description:</strong> Explain what you accomplished
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-yellow-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-yellow-400 text-sm font-mono">4</span>
              </div>
              <div>
                <p className="text-gray-300 font-mono text-sm">
                  <strong className="text-green-400">Wait for approval:</strong> Graders will review your submission
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'leaderboard',
      title: 'Leaderboard & Progress',
      description: 'Track your progress and compete with others',
      icon: <Users className="h-8 w-8 text-purple-400" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-300 font-mono">
            The leaderboard shows real-time rankings and your progress through the platform.
          </p>
          <div className="space-y-3">
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <h4 className="text-green-400 font-mono font-bold mb-2">Live Rankings</h4>
              <p className="text-gray-300 font-mono text-sm">
                See where you stand among all students in real-time
              </p>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <h4 className="text-blue-400 font-mono font-bold mb-2">Progress Tracking</h4>
              <p className="text-gray-300 font-mono text-sm">
                Visual progress bars show your completion status
              </p>
            </div>
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
              <h4 className="text-purple-400 font-mono font-bold mb-2">Achievement Levels</h4>
              <p className="text-gray-300 font-mono text-sm">
                Level up as you earn more points and complete challenges
              </p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const handleNext = () => {
    setCompletedSteps(prev => new Set([...prev, currentStep]));
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  if (!isOpen) return null;

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <Card variant="matrix" className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {currentStepData.icon}
              <div>
                <CardTitle className="text-xl font-mono text-green-400">
                  {currentStepData.title}
                </CardTitle>
                <p className="text-gray-400 font-mono text-sm">
                  {currentStepData.description}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-green-400 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs font-mono text-gray-400 mb-2">
              <span>Step {currentStep + 1} of {steps.length}</span>
              <span>{Math.round(((currentStep + 1) / steps.length) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {currentStepData.content}
          
          <div className="flex justify-between items-center pt-4 border-t border-green-500/30">
            <div className="flex space-x-2">
              {!isFirstStep && (
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  className="border-green-500/50 text-green-400 hover:bg-green-500/10"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
              )}
              <Button
                variant="outline"
                onClick={handleSkip}
                className="border-gray-500/50 text-gray-400 hover:bg-gray-500/10"
              >
                Skip Tutorial
              </Button>
            </div>
            
            <Button
              variant="matrix"
              onClick={handleNext}
              className="flex items-center space-x-2"
            >
              <span>{isLastStep ? 'Get Started' : 'Next'}</span>
              {isLastStep ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <ArrowRight className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
