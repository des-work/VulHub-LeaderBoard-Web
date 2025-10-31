'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to auth page immediately
    router.replace('/auth');
  }, [router]);

  return (
    <div className="min-h-screen bg-black text-neutral-100 font-body flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xl text-neutral-300">Redirecting to sign in...</p>
      </div>
    </div>
  );
}

