import { Suspense } from 'react';
import { Button } from '@vulhub/ui';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@vulhub/ui';
import { Badge } from '@vulhub/ui';
import { UnifiedIcon, Terminology, VisualEffect, CustomizationPanel } from '@vulhub/ui';
import { Trophy, Users, Target, Award, Settings } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <VisualEffect type="glow">
                <UnifiedIcon name="trophy" size={32} className="text-blue-600" />
              </VisualEffect>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                <Terminology>VulHub Leaderboard</Terminology>
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative group">
                <Button variant="outline" size="sm" className="flex items-center space-x-2">
                  <Settings className="h-4 w-4" />
                  <span>Customize</span>
                </Button>
                <div className="absolute right-0 top-full mt-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 max-h-96 overflow-y-auto">
                  <CustomizationPanel />
                </div>
              </div>
              <Button variant="outline" size="sm">
                Sign In
              </Button>
              <Button size="sm">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            <Terminology>Master Cybersecurity Through Competition</Terminology>
            <span className="text-blue-600"> Competition</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            <Terminology>
              Join the ultimate cybersecurity learning platform where students compete, 
              learn, and grow through real-world vulnerability challenges.
            </Terminology>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-6">
              Start Learning Now
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6">
              View Leaderboard
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose VulHub Leaderboard?
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Our platform combines gamification with real-world cybersecurity challenges 
              to create an engaging learning experience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardHeader>
                <VisualEffect type="glow">
                  <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                    <UnifiedIcon name="castle" size={24} className="text-blue-600" />
                  </div>
                </VisualEffect>
                <CardTitle>
                  <Terminology>Competitive Learning</Terminology>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  <Terminology>
                    Compete with peers on real vulnerability challenges and climb the leaderboards.
                  </Terminology>
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <VisualEffect type="glow">
                  <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                    <UnifiedIcon name="shield" size={24} className="text-green-600" />
                  </div>
                </VisualEffect>
                <CardTitle>
                  <Terminology>Community Driven</Terminology>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  <Terminology>
                    Learn from and collaborate with a community of cybersecurity enthusiasts.
                  </Terminology>
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <VisualEffect type="glow">
                  <div className="mx-auto w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                    <UnifiedIcon name="sword" size={24} className="text-purple-600" />
                  </div>
                </VisualEffect>
                <CardTitle>
                  <Terminology>Real Challenges</Terminology>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  <Terminology>
                    Practice on real-world vulnerabilities and hone your practical skills.
                  </Terminology>
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <VisualEffect type="glow">
                  <div className="mx-auto w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mb-4">
                    <UnifiedIcon name="award" size={24} className="text-orange-600" />
                  </div>
                </VisualEffect>
                <CardTitle>
                  <Terminology>Achievement System</Terminology>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  <Terminology>
                    Earn badges and achievements as you progress through different skill levels.
                  </Terminology>
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-blue-600 dark:bg-blue-800">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-blue-100">Active Students</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-blue-100">Vulnerability Challenges</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">1000+</div>
              <div className="text-blue-100">Submissions Reviewed</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-blue-100">Student Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Start Your Cybersecurity Journey?
          </h3>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of students who are already mastering cybersecurity through our 
            gamified learning platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-6">
              Sign Up Now
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Trophy className="h-6 w-6" />
                <span className="text-xl font-bold">VulHub Leaderboard</span>
              </div>
              <p className="text-gray-400">
                Empowering the next generation of cybersecurity professionals.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Leaderboards</li>
                <li>Challenges</li>
                <li>Badges</li>
                <li>Community</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Documentation</li>
                <li>Tutorials</li>
                <li>API</li>
                <li>Support</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Discord</li>
                <li>GitHub</li>
                <li>Twitter</li>
                <li>LinkedIn</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 CSUSB Cybersecurity Program. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
