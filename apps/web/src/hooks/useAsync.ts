import { useEffect, useRef, useState } from 'react';

export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';

export function useAsync<T>(fn: (signal: AbortSignal) => Promise<T>, deps: any[] = []) {
  const [status, setStatus] = useState<AsyncStatus>('idle');
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setStatus('loading');
    setError(null);
    fn(controller.signal)
      .then((d) => { if (!controller.signal.aborted) { setData(d); setStatus('success'); } })
      .catch((e) => { if (!controller.signal.aborted) { setError(e instanceof Error ? e : new Error(String(e))); setStatus('error'); } });
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { status, data, error };
}
