import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../lib/supabaseClient';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'processing' | 'error' | 'success'>('processing');
  const [info, setInfo] = useState<any>(null);
  const handledRef = useRef(false);

  useEffect(() => {
    if (handledRef.current) {
      return; // Prevent duplicate runs in React StrictMode
    }
    handledRef.current = true;
    // Exchange the code for a session
    const handleAuthCallback = async () => {
      try {
        const { searchParams, hash } = new URL(window.location.href);
        const code = searchParams.get('code');
        const state = searchParams.get('state');

        // Check for OAuth errors in URL fragments
        const hashParams = new URLSearchParams(hash.slice(1));
        const error = hashParams.get('error');
        const errorCode = hashParams.get('error_code');
        const errorDescription = hashParams.get('error_description');

        if (error || errorCode) {
          const details = {
            error,
            errorCode,
            errorDescription,
            fullURL: window.location.href,
          };
          console.error('OAuth Error:', details);
          setStatus('error');
          setInfo(details);
          return;
        }

        // Support implicit flow (tokens in hash) as a fallback
        const hasImplicitTokens = hashParams.has('access_token') || hashParams.has('refresh_token');
        if (!code && hasImplicitTokens) {
          console.log('[AuthCallback] Detected implicit tokens in URL hash');

          // Prefer getSessionFromUrl if available in the current supabase-js build
          const getSessionFromUrlFn = (supabase as any)?.auth?.getSessionFromUrl;
          if (typeof getSessionFromUrlFn === 'function') {
            console.log('[AuthCallback] Using supabase.auth.getSessionFromUrl');
            const { data, error: parseError } = await getSessionFromUrlFn({ storeSession: true });
            if (parseError) {
              console.error('[AuthCallback] Failed to parse session from URL (implicit flow):', parseError);
              setStatus('error');
              setInfo({ message: 'Failed to get session from URL (implicit flow)', error: parseError });
              return;
            }
            // Clean the URL hash to avoid leaking tokens
            history.replaceState(null, '', window.location.pathname + window.location.search);
            console.log('[AuthCallback] Session established (implicit via getSessionFromUrl):', { user: data?.session?.user?.id, expires_at: data?.session?.expires_at });
            setStatus('success');
            setTimeout(() => navigate('/'), 500);
            return;
          }

          // Fallback: manually set session from hash tokens
          const access_token = hashParams.get('access_token') || undefined;
          const refresh_token = hashParams.get('refresh_token') || undefined;
          if (!access_token || !refresh_token) {
            const details = { message: 'Implicit tokens found but access_token/refresh_token missing', fullURL: window.location.href };
            console.error('[AuthCallback] Implicit flow parsing error:', details);
            setStatus('error');
            setInfo(details);
            return;
          }
          console.log('[AuthCallback] Setting session from URL hash via supabase.auth.setSession');
          const { data: setData, error: setErr } = await supabase.auth.setSession({ access_token, refresh_token });
          if (setErr) {
            console.error('[AuthCallback] Failed to set session from tokens:', setErr);
            setStatus('error');
            setInfo({ message: 'Failed to set session from tokens', error: setErr });
            return;
          }
          // Clean the URL hash to avoid leaking tokens
          history.replaceState(null, '', window.location.pathname + window.location.search);
          console.log('[AuthCallback] Session established (implicit via setSession):', { user: setData?.user?.id, expires_at: setData?.session?.expires_at });
          setStatus('success');
          setTimeout(() => navigate('/'), 500);
          return;
        }

        if (!code) {
          const details = { message: 'No authorization code found in callback URL.', fullURL: window.location.href };
          console.error('OAuth Callback Error:', details);
          setStatus('error');
          setInfo(details);
          return;
        }

        console.log('[AuthCallback] Exchanging code for session...', { statePresent: !!state });
        const { error: exchangeError, data } = await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError) {
          console.error('Session exchange error:', exchangeError);
          setStatus('error');
          setInfo({ message: 'Session exchange failed', error: exchangeError });
          return;
        }

        console.log('[AuthCallback] Session established:', { user: data?.user?.id, expires_at: data?.session?.expires_at });
        setStatus('success');
        // Small delay so the user can see the success message
        setTimeout(() => navigate('/'), 500);
      } catch (error: any) {
        console.error('Error handling auth callback:', error);
        setStatus('error');
        setInfo({ message: 'Callback error', error: { message: error?.message, stack: error?.stack } });
      }
    };

    handleAuthCallback();

    return () => {
      // Allow re-handling if user re-enters this route from scratch
      handledRef.current = false;
    };
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      {status === 'processing' && (
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Completing sign in...</h2>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-slate-500">Please wait while we finalize your session.</p>
        </div>
      )}

      {status === 'success' && (
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Signed in!</h2>
          <p className="text-slate-600">Redirecting you to the app…</p>
          <button onClick={() => navigate('/')} className="mt-4 px-4 py-2 rounded bg-blue-600 text-white">Go now</button>
        </div>
      )}

      {status === 'error' && (
        <div className="w-full max-w-2xl">
          <h2 className="text-2xl font-semibold mb-2 text-red-600">Authentication failed</h2>
          <p className="mb-4 text-slate-600">We couldn't complete the sign-in. Details are shown below to help diagnose the issue.</p>
          <div className="rounded bg-slate-900 text-slate-100 p-4 text-sm overflow-auto">
            <pre className="whitespace-pre-wrap break-words">{JSON.stringify(info, null, 2)}</pre>
          </div>
          <div className="mt-4 flex gap-2">
            <button onClick={() => navigate('/')} className="px-4 py-2 rounded bg-slate-700 text-white">Back to Home</button>
            <button onClick={() => window.location.reload()} className="px-4 py-2 rounded border border-slate-300">Retry</button>
          </div>
        </div>
      )}
    </div>
  );
}