"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../lib/ui/card';
import { Button } from '../../lib/ui/button';
import { ExternalLink, BookOpen, Rocket, Info, Users } from 'lucide-react';

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-black text-neutral-100 font-body">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-display text-purple-300 spectacular-text-glow">VulHub Resources</h1>
          <p className="text-neutral-400 mt-3 max-w-3xl mx-auto">
            Vulhub is an open‑source collection of pre‑built, ready‑to‑use vulnerable Docker environments. With just one command you can launch an environment for security research, learning, or demos.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <a href="https://vulhub.org" target="_blank" rel="noreferrer">
              <Button className="btn-professional btn-primary"><ExternalLink className="h-4 w-4 mr-2"/> Visit vulhub.org</Button>
            </a>
            <a href="https://github.com/vulhub/vulhub" target="_blank" rel="noreferrer">
              <Button variant="outline" className="border-neutral-600/50 text-neutral-300 hover:bg-neutral-800/50"><ExternalLink className="h-4 w-4 mr-2"/> GitHub Repo</Button>
            </a>
          </div>
        </div>

        {/* Quick Start */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-purple-300 font-display flex items-center"><Rocket className="h-5 w-5 mr-2"/> Quick Start</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">1) Install Docker (example for Ubuntu 24.04)</h3>
              <pre className="bg-neutral-900 border border-neutral-800 rounded p-4 overflow-auto text-sm"><code>{`# Install the latest version docker
curl -s https://get.docker.com/ | sh

# Run docker service
systemctl start docker`}</code></pre>
              <p className="text-neutral-400 mt-2">For other operating systems, see the <a className="text-purple-300 underline" href="https://docs.docker.com/" target="_blank" rel="noreferrer">Docker documentation</a>.</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">2) Download and set up Vulhub</h3>
              <pre className="bg-neutral-900 border border-neutral-800 rounded p-4 overflow-auto text-sm"><code>{`git clone --depth 1 https://github.com/vulhub/vulhub`}</code></pre>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">3) Launch a vulnerable environment</h3>
              <pre className="bg-neutral-900 border border-neutral-800 rounded p-4 overflow-auto text-sm"><code>{`cd vulhub/langflow/CVE-2025-3248  # Example: enter a vulnerability directory

docker compose up -d`}</code></pre>
              <p className="text-neutral-400 mt-2">Each environment folder contains a README with reproduction steps and usage instructions.</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">4) Clean up after testing</h3>
              <pre className="bg-neutral-900 border border-neutral-800 rounded p-4 overflow-auto text-sm"><code>{`docker compose down -v`}</code></pre>
            </div>
          </CardContent>
        </Card>

        {/* Important Notes */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-purple-300 font-display flex items-center"><Info className="h-5 w-5 mr-2"/> Important Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-neutral-300">
              <li>Use a VPS or VM with at least 1GB RAM for best results.</li>
              <li>The <span className="font-mono">your-ip</span> in docs refers to your host/VPS IP, not the Docker container IP.</li>
              <li>You can use the built‑in <span className="font-mono">docker compose</span> command; separate docker‑compose install is not required.</li>
              <li>Ensure Docker can access files in the current directory to avoid permission errors.</li>
              <li>Vulhub currently supports only x86 architectures (not ARM).</li>
              <li><strong>All environments are for testing and educational purposes only. Do not use in production!</strong></li>
            </ul>
          </CardContent>
        </Card>

        {/* Contributing */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-purple-300 font-display flex items-center"><BookOpen className="h-5 w-5 mr-2"/> Contributing & Support</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-neutral-300">
            <p>If you encounter errors, confirm whether they’re caused by Docker or dependencies first. If you find an issue with a Dockerfile or Vulhub code, submit an issue. See the <a className="text-purple-300 underline" href="https://vulhub.org/documentation/faq" target="_blank" rel="noreferrer">FAQ</a> for troubleshooting.</p>
            <p>Community links: <a className="text-purple-300 underline" href="https://discord.gg/bQCpZEK" target="_blank" rel="noreferrer">Discord</a> • <a className="text-purple-300 underline" href="https://twitter.com/vulhub" target="_blank" rel="noreferrer">Twitter</a></p>
          </CardContent>
        </Card>

        {/* Partners (links only for brevity) */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-purple-300 font-display flex items-center"><Users className="h-5 w-5 mr-2"/> Partners</CardTitle>
          </CardHeader>
          <CardContent className="text-neutral-300">
            <p>Visit the Vulhub website to view partners and sponsors: <a className="text-purple-300 underline" href="https://vulhub.org" target="_blank" rel="noreferrer">vulhub.org</a></p>
          </CardContent>
        </Card>

        {/* Credit */}
        <div className="text-center text-neutral-400">
          <p>
            This page summarizes instructions from the official Vulhub project. All credit to the Vulhub team and contributors. Vulhub is licensed under MIT — see
            {" "}
            <a className="text-purple-300 underline" href="https://github.com/vulhub/vulhub/blob/master/LICENSE" target="_blank" rel="noreferrer">LICENSE</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
