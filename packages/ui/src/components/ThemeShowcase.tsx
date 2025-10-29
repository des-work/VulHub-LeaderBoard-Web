import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@vulhub/ui';
import { Button } from '@vulhub/ui';
import { Themes, MedievalTerminology, CastleIcon, ShieldIcon, SwordIcon } from '@vulhub/ui';
import { MatrixRain, CyberpunkGlow, NeonBorder } from '@vulhub/ui';
import { TerminalWindow, TerminalPrompt, TerminalOutput } from '@vulhub/ui';
import { HackerTerminology } from '@vulhub/ui';
import { Trophy, Users, Target, Award } from 'lucide-react';

export const ThemeShowcase: React.FC = () => {
  const { theme } = Themes.useTheme();

  return (
    <div className="min-h-screen p-8">
      {/* Theme-specific background effects */}
      {theme === 'matrix' && <MatrixRain intensity="medium" />}
      
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">
            <MedievalTerminology>Theme Showcase</MedievalTerminology>
          </h1>
          <p className="text-lg text-muted-foreground">
            <MedievalTerminology>
              Experience the different realms of our platform
            </MedievalTerminology>
          </p>
        </div>

        {/* Theme Selector */}
        <Card>
          <CardHeader>
            <CardTitle>Choose Your Realm</CardTitle>
          </CardHeader>
          <CardContent>
            <Themes.Selector />
          </CardContent>
        </Card>

        {/* Theme-specific content */}
        {theme === 'medieval' && (
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardHeader>
                <CastleIcon className="h-12 w-12 mx-auto text-yellow-600 mb-4" />
                <CardTitle>The Castle</CardTitle>
              </CardHeader>
              <CardContent>
                <MedievalTerminology>
                  <p>Welcome to the realm of knights and squires. Here you shall train in the art of defense and earn your honor through noble quests.</p>
                </MedievalTerminology>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <ShieldIcon className="h-12 w-12 mx-auto text-yellow-600 mb-4" />
                <CardTitle>The Shield</CardTitle>
              </CardHeader>
              <CardContent>
                <MedievalTerminology>
                  <p>Protect the kingdom from digital threats. Your shield shall be your greatest ally in the battle against vulnerabilities.</p>
                </MedievalTerminology>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <SwordIcon className="h-12 w-12 mx-auto text-yellow-600 mb-4" />
                <CardTitle>The Sword</CardTitle>
              </CardHeader>
              <CardContent>
                <MedievalTerminology>
                  <p>Master the blade of cybersecurity. Each quest completed brings you closer to becoming a legendary champion.</p>
                </MedievalTerminology>
              </CardContent>
            </Card>
          </div>
        )}

        {theme === 'matrix' && (
          <div className="space-y-6">
            <CyberpunkGlow color="green" intensity="high">
              <Card className="bg-black border-green-500">
                <CardHeader>
                  <CardTitle className="text-green-400 font-mono">Welcome to the Matrix</CardTitle>
                </CardHeader>
                <CardContent>
                  <TerminalWindow title="Matrix Terminal">
                    <TerminalPrompt user="neo" host="matrix" path="/cyber">
                      <span>Welcome to the digital realm</span>
                    </TerminalPrompt>
                    <TerminalOutput>
                      <div>Loading cybersecurity protocols...</div>
                      <div>Initializing defense systems...</div>
                      <div>Ready to hack the mainframe!</div>
                    </TerminalOutput>
                  </TerminalWindow>
                </CardContent>
              </Card>
            </CyberpunkGlow>

            <div className="grid md:grid-cols-3 gap-6">
              <NeonBorder color="green" thickness="medium">
                <Card className="bg-black text-green-400">
                  <CardHeader>
                    <CardTitle className="font-mono">Code Rain</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-mono text-sm">
                      The Matrix rain effect creates an immersive cyberpunk atmosphere
                      with falling green code characters.
                    </p>
                  </CardContent>
                </Card>
              </NeonBorder>

              <NeonBorder color="green" thickness="medium">
                <Card className="bg-black text-green-400">
                  <CardHeader>
                    <CardTitle className="font-mono">Neon Glow</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-mono text-sm">
                      Glowing text and borders create the signature Matrix aesthetic
                      with bright green neon effects.
                    </p>
                  </CardContent>
                </Card>
              </NeonBorder>

              <NeonBorder color="green" thickness="medium">
                <Card className="bg-black text-green-400">
                  <CardHeader>
                    <CardTitle className="font-mono">Terminal UI</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-mono text-sm">
                      Terminal-style components with monospace fonts and
                      command-line aesthetics.
                    </p>
                  </CardContent>
                </Card>
              </NeonBorder>
            </div>
          </div>
        )}

        {theme === 'cyber' && (
          <div className="space-y-6">
            <CyberpunkGlow color="pink" intensity="high">
              <Card className="bg-slate-900 border-pink-500">
                <CardHeader>
                  <CardTitle className="text-pink-400">Cyberpunk Realm</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-pink-300">
                    Welcome to the neon-lit streets of cyberspace. Here, hot pink and electric blue
                    create a futuristic atmosphere perfect for cyber warfare.
                  </p>
                </CardContent>
              </Card>
            </CyberpunkGlow>

            <div className="grid md:grid-cols-3 gap-6">
              <NeonBorder color="pink" thickness="medium">
                <Card className="bg-slate-800 text-pink-300">
                  <CardHeader>
                    <CardTitle>Neon Streets</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Experience the vibrant cyberpunk aesthetic with glowing pink accents
                    and futuristic styling.</p>
                  </CardContent>
                </Card>
              </NeonBorder>

              <NeonBorder color="blue" thickness="medium">
                <Card className="bg-slate-800 text-blue-300">
                  <CardHeader>
                    <CardTitle>Electric Dreams</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Blue neon highlights complement the pink theme, creating
                    a balanced cyberpunk color palette.</p>
                  </CardContent>
                </Card>
              </NeonBorder>

              <NeonBorder color="purple" thickness="medium">
                <Card className="bg-slate-800 text-purple-300">
                  <CardHeader>
                    <CardTitle>Digital Shadows</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Purple accents add depth to the cyberpunk theme,
                    creating a rich, layered visual experience.</p>
                  </CardContent>
                </Card>
              </NeonBorder>
            </div>
          </div>
        )}

        {theme === 'hacker90s' && (
          <div className="space-y-6">
            <TerminalWindow title="90s Hacker Terminal" className="bg-black">
              <TerminalPrompt user="hacker" host="mainframe" path="/root">
                <span>Welcome to the 90s hacker scene</span>
              </TerminalPrompt>
              <TerminalOutput>
                <div>Initializing retro terminal...</div>
                <div>Loading ASCII art...</div>
                <div>Ready to hack the Gibson!</div>
              </TerminalOutput>
            </TerminalWindow>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-gray-900 text-green-400 border-green-500">
                <CardHeader>
                  <CardTitle className="font-mono">Retro Terminal</CardTitle>
                </CardHeader>
                <CardContent>
                  <HackerTerminology>
                    <p className="font-mono text-sm">
                      Experience the authentic 90s hacker aesthetic with bright green
                      text on black backgrounds and monospace fonts.
                    </p>
                  </HackerTerminology>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 text-green-400 border-green-500">
                <CardHeader>
                  <CardTitle className="font-mono">Script Kiddie Vibes</CardTitle>
                </CardHeader>
                <CardContent>
                  <HackerTerminology>
                    <p className="font-mono text-sm">
                      Channel your inner script kiddie with retro terminology
                      and authentic 90s hacker slang.
                    </p>
                  </HackerTerminology>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 text-green-400 border-green-500">
                <CardHeader>
                  <CardTitle className="font-mono">Matrix Memories</CardTitle>
                </CardHeader>
                <CardContent>
                  <HackerTerminology>
                    <p className="font-mono text-sm">
                      Relive the golden age of hacking with terminal-style
                      interfaces and classic hacker aesthetics.
                    </p>
                  </HackerTerminology>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {theme === 'ocean' && (
          <div className="space-y-6">
            <Card className="bg-teal-900 text-teal-100 border-teal-500">
              <CardHeader>
                <CardTitle>Ocean Depths</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Dive into the calm and serene ocean theme. Teal and emerald colors
                  create a peaceful underwater atmosphere perfect for focused learning.
                </p>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-teal-800 text-teal-100 border-teal-400">
                <CardHeader>
                  <CardTitle>Calm Waters</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>The ocean theme provides a tranquil environment for
                  cybersecurity learning and practice.</p>
                </CardContent>
              </Card>

              <Card className="bg-teal-800 text-teal-100 border-teal-400">
                <CardHeader>
                  <CardTitle>Deep Focus</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Emerald and teal colors help maintain focus during
                  long study sessions and coding challenges.</p>
                </CardContent>
              </Card>

              <Card className="bg-teal-800 text-teal-100 border-teal-400">
                <CardHeader>
                  <CardTitle>Serene Learning</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Create a peaceful learning environment with the
                  ocean theme's soothing color palette.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Default themes showcase */}
        {(theme === 'light' || theme === 'dark') && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {theme === 'light' ? 'Light Theme' : 'Dark Theme'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  {theme === 'light' 
                    ? 'Clean and bright interface perfect for daytime use and accessibility.'
                    : 'Easy on the eyes with a dark color scheme ideal for extended use.'
                  }
                </p>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <Trophy className="h-8 w-8 text-blue-600 mb-2" />
                  <CardTitle>Clean Design</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Modern, clean interface design with excellent readability
                  and user experience.</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Users className="h-8 w-8 text-green-600 mb-2" />
                  <CardTitle>Accessible</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>High contrast and accessibility features ensure
                  the platform is usable by everyone.</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Target className="h-8 w-8 text-purple-600 mb-2" />
                  <CardTitle>Professional</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Professional appearance suitable for educational
                  and corporate environments.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
