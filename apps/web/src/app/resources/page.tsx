"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { ExternalLink, BookOpen, Rocket, Info, Users, ArrowLeft } from 'lucide-react';

export default function ResourcesPage() {
  const router = useRouter();
  
  return (
    <div className="min-h-screen bg-black text-neutral-100 font-body">
      <div className="container mx-auto px-4 py-12">
        <button 
          onClick={() => router.push('/')}
          className="matrix-button matrix-button-outline mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </button>

        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-display text-matrix-glow">VulHub Resources</h1>
          <p className="text-muted mt-3 max-w-3xl mx-auto">
            Vulhub is an open‑source collection of pre‑built, ready‑to‑use vulnerable Docker environments. With just one command you can launch an environment for security research, learning, or demos.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <a href="https://vulhub.org" target="_blank" rel="noreferrer">
              <button className="matrix-button matrix-button-primary"><ExternalLink className="h-4 w-4 mr-2"/> Visit vulhub.org</button>
            </a>
            <a href="https://github.com/vulhub/vulhub" target="_blank" rel="noreferrer">
              <button className="matrix-button matrix-button-outline"><ExternalLink className="h-4 w-4 mr-2"/> GitHub Repo</button>
            </a>
          </div>
        </div>

        {/* Quick Start */}
        <div className="matrix-card mb-8">
          <div className="matrix-card-header">
            <h2 className="text-xl font-display font-bold text-matrix flex items-center"><Rocket className="h-5 w-5 mr-2"/> Quick Start</h2>
          </div>
          <div className="matrix-card-content space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-bright mb-2">1) Install Docker (example for Ubuntu 24.04)</h3>
              <pre className="bg-neutral-900 border border-matrix/30 rounded p-4 overflow-auto text-sm text-matrix"><code>{`# Install the latest version docker
curl -s https://get.docker.com/ | sh

# Run docker service
systemctl start docker`}</code></pre>
              <p className="text-muted mt-2">For other operating systems, see the <a className="text-matrix hover:text-matrix-bright underline" href="https://docs.docker.com/" target="_blank" rel="noreferrer">Docker documentation</a>.</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-bright mb-2">2) Download and set up Vulhub</h3>
              <pre className="bg-neutral-900 border border-matrix/30 rounded p-4 overflow-auto text-sm text-matrix"><code>{`git clone --depth 1 https://github.com/vulhub/vulhub`}</code></pre>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-bright mb-2">3) Launch a vulnerable environment</h3>
              <pre className="bg-neutral-900 border border-matrix/30 rounded p-4 overflow-auto text-sm text-matrix"><code>{`cd vulhub/langflow/CVE-2025-3248  # Example: enter a vulnerability directory

docker compose up -d`}</code></pre>
              <p className="text-muted mt-2">Each environment folder contains a README with reproduction steps and usage instructions.</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-bright mb-2">4) Clean up after testing</h3>
              <pre className="bg-neutral-900 border border-matrix/30 rounded p-4 overflow-auto text-sm text-matrix"><code>{`docker compose down -v`}</code></pre>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div className="matrix-card mb-8">
          <div className="matrix-card-header">
            <h2 className="text-xl font-display font-bold text-matrix flex items-center"><Info className="h-5 w-5 mr-2"/> Important Notes</h2>
          </div>
          <div className="matrix-card-content">
            <ul className="list-disc list-inside space-y-2 text-bright">
              <li>Use a VPS or VM with at least 1GB RAM for best results.</li>
              <li>The <span className="font-mono text-matrix">your-ip</span> in docs refers to your host/VPS IP, not the Docker container IP.</li>
              <li>You can use the built‑in <span className="font-mono text-matrix">docker compose</span> command; separate docker‑compose install is not required.</li>
              <li>Ensure Docker can access files in the current directory to avoid permission errors.</li>
              <li>Vulhub currently supports only x86 architectures (not ARM).</li>
              <li><strong className="text-matrix-glow">All environments are for testing and educational purposes only. Do not use in production!</strong></li>
            </ul>
          </div>
        </div>

        {/* Contributing */}
        <div className="matrix-card mb-8">
          <div className="matrix-card-header">
            <h2 className="text-xl font-display font-bold text-matrix flex items-center"><BookOpen className="h-5 w-5 mr-2"/> Contributing & Support</h2>
          </div>
          <div className="matrix-card-content space-y-2 text-bright">
            <p>If you encounter errors, confirm whether they're caused by Docker or dependencies first. If you find an issue with a Dockerfile or Vulhub code, submit an issue. See the <a className="text-matrix hover:text-matrix-bright underline" href="https://vulhub.org/documentation/faq" target="_blank" rel="noreferrer">FAQ</a> for troubleshooting.</p>
            <p>Community links: <a className="text-matrix hover:text-matrix-bright underline" href="https://discord.gg/bQCpZEK" target="_blank" rel="noreferrer">Discord</a> • <a className="text-matrix hover:text-matrix-bright underline" href="https://twitter.com/vulhub" target="_blank" rel="noreferrer">Twitter</a></p>
          </div>
        </div>

        {/* Partners (links only for brevity) */}
        <div className="matrix-card mb-8">
          <div className="matrix-card-header">
            <h2 className="text-xl font-display font-bold text-matrix flex items-center"><Users className="h-5 w-5 mr-2"/> Partners</h2>
          </div>
          <div className="matrix-card-content text-bright">
            <p>Visit the Vulhub website to view partners and sponsors: <a className="text-matrix hover:text-matrix-bright underline" href="https://vulhub.org" target="_blank" rel="noreferrer">vulhub.org</a></p>
          </div>
        </div>

        {/* Credit */}
        <div className="text-center text-muted">
          <p>
            This page summarizes instructions from the official Vulhub project. All credit to the Vulhub team and contributors. Vulhub is licensed under MIT — see
            {" "}
            <a className="text-matrix hover:text-matrix-bright underline" href="https://github.com/vulhub/vulhub/blob/master/LICENSE" target="_blank" rel="noreferrer">LICENSE</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
