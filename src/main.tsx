import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import App from './App.tsx';
import { MoveProvider } from './dnd-kit/MoveContext.tsx';
import { DndContext } from '@dnd-kit/core';
import { ThemeProvider } from './contexts/ThemeContext.tsx';
import AuthCallback from './auth/callback.tsx';
import SharedView from './components/SharedView.tsx';
import ProfileSettings from './components/ProfileSettings.tsx';
import MobileDashboard from './components/MobileDashboard.tsx';
import { useIsMobile } from './hooks/use-mobile.ts';

// Responsive root: choose mobile or desktop based on screen width
function RootResponsive() {
  const isMobile = useIsMobile();
  return isMobile ? <MobileDashboard /> : <App />;
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootResponsive />, // Responsive: mobile on small screens, desktop otherwise
  },
  {
    path: '/app',
    element: <App />, // Direct access to desktop UI
  },
  {
    path: '/auth/callback',
    element: <AuthCallback />,
  },
  {
    path: '/shared/prompt',
    element: <SharedView type="prompt" />,
  },
  {
    path: '/shared/tool',
    element: <SharedView type="tool" />,
  },
  {
    path: '/profile/:username',
    element: <SharedView type="profile" />,
  },
  {
    path: '/settings/profile',
    element: <ProfileSettings />,
  },
  {
    path: '/mobile',
    element: <MobileDashboard />, // Optional: force mobile view
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <MoveProvider>
        <DndContext>
          <RouterProvider router={router} />
        </DndContext>
      </MoveProvider>
    </ThemeProvider>
  </StrictMode>
);

// Log any Content Security Policy violations with useful details
if (typeof document !== 'undefined') {
  document.addEventListener('securitypolicyviolation', (e: SecurityPolicyViolationEvent) => {
    const details = {
      violatedDirective: e.violatedDirective,
      effectiveDirective: (e as any).effectiveDirective,
      blockedURI: e.blockedURI,
      sourceFile: e.sourceFile,
      lineNumber: e.lineNumber,
      columnNumber: e.columnNumber,
      disposition: (e as any).disposition,
      statusCode: (e as any).statusCode,
      originalPolicy: (e as any).originalPolicy,
    };
    console.error('[CSP] Violation detected:', details);
    // Show a one-time alert to surface this quickly during debugging
    if (!(window as any).__cspAlertShown) {
      (window as any).__cspAlertShown = true;
      alert(
        `CSP violation on this page.\n` +
        `violatedDirective: ${details.violatedDirective}\n` +
        `blockedURI: ${details.blockedURI || 'n/a'}\n` +
        `sourceFile: ${details.sourceFile || 'n/a'}:${details.lineNumber || ''}`
      );
    }
  });
}

// Dev-only CSP diagnostics
if (import.meta && (import.meta as any).env && (import.meta as any).env.DEV) {
  try {
    // Check if eval/new Function are actually blocked in this environment
    let evalWorks = true;
    try {
      // eslint-disable-next-line no-new-func
      const fn = new Function('return 42');
      const v = fn();
      console.log('[CSP][diag] new Function result:', v);
    } catch (e) {
      evalWorks = false;
      console.warn('[CSP][diag] new Function appears blocked by policy/environment:', e);
    }

    // Fetch current page to inspect CSP headers sent by the dev server
    fetch(window.location.href, { cache: 'no-store' })
      .then((res) => {
        const csp = res.headers.get('content-security-policy');
        const xcsp = res.headers.get('x-content-security-policy');
        const webkitcsp = res.headers.get('x-webkit-csp');
        console.log('[CSP][diag] Response headers:', {
          'content-security-policy': csp,
          'x-content-security-policy': xcsp,
          'x-webkit-csp': webkitcsp,
          evalBlocked: !evalWorks,
        });
      })
      .catch((e) => {
        console.warn('[CSP][diag] Failed to fetch current page headers:', e);
      });
  } catch (e) {
    console.warn('[CSP][diag] Diagnostics failed:', e);
  }
}